import { Popup } from '../models'
import { Op, WhereOptions } from 'sequelize'
import { Pagination, UserAttributesPublic } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { PopupAttributes, PopupAttributesCreation, PopupAttributesUpdate } from '@brz/shared'
import { searchWhere } from '../utils/model.utils'
import { POPUP_CONSTRAINTS, POPUP_INCLUDE_DEFAULTS } from '../models/popup.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'
import { permissionCheck } from '../utils/auth.utils'
import { validateAll } from '../utils/validation.utils'
import { Terminal } from '../utils/terminal.utils'

export class PopupService {
  private filterIsActive(is_active?: boolean | null): WhereOptions {
    if (!is_active) return {}
    return { is_active }
  }

  public async count(options?: { search?: string, is_active?: boolean | null }): Promise<number> {
    const { is_active, search } = options || {}

    const where: WhereOptions = {
      ...this.filterIsActive(is_active),
      ...searchWhere(POPUP_CONSTRAINTS, search)
    }

    const result = await Popup.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string; is_active?: boolean | null }, order: Order[] = [], pagination?: Pagination | null, user?: UserAttributesPublic): Promise<PopupAttributes[]> {
    const { is_active, search } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    if (
      (!is_active) // only allow non-published popups if allowed to
    ) {
      await permissionCheck(user, 'popup', 'read')
    }

    const where: WhereOptions = {
      ...this.filterIsActive(is_active),
      ...searchWhere(POPUP_CONSTRAINTS, search)
    }

    const popups = await Popup.findAll({ where, order, offset, limit, include: POPUP_INCLUDE_DEFAULTS })
    return popups
  }

  public async getById(id: number, options?: { is_active?: boolean | null }): Promise<PopupAttributes | null> {
    const { is_active } = options || {}

    const where: WhereOptions = {
      ...this.filterIsActive(is_active),
      id
    }

    const popup = await Popup.findOne({ where, include: POPUP_INCLUDE_DEFAULTS })
    if (!popup) throw new NotFound('Popup not found')
    return popup
  }

  public async create(data: PopupAttributesCreation): Promise<PopupAttributes | null> {
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, POPUP_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return Popup.create(data, { transaction, include: POPUP_INCLUDE_DEFAULTS })
    })
  }

  public async update(id: number, data: PopupAttributesUpdate): Promise<PopupAttributes | null> {
    const { valid, errors } = validateAll(data, POPUP_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const popup = await Popup.findByPk(id, { transaction, include: POPUP_INCLUDE_DEFAULTS })
      if (!popup) throw new NotFound('Popup not found')

      await popup.update(data, { transaction })
      return popup
    }).then(async (popup) => {
      if (!popup) return null
      return popup
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await Popup.destroy({ where: { id } })
    if (!result) throw new NotFound('Popup not found')
    return result
  }

  /**
   * Computes and updates popup is_active based on date_from and date_to dates.
   *
   * Rules:
   * - date_from in the future              => flase (not yet visible)
   * - date_to in the past                  => false (expired)
   * - date_from in the past AND end future => true (within window)
   *
   * Processes updates in chunks to avoid long-running locks on the DB.
   */
  public async computeActive(): Promise<void> {
    const CHUNK_SIZE = 500

    Terminal.info('Computing popup is_active ...')

    const now = new Date()

    // Define each transition rule: a WHERE clause => target is_active
    const transitions: { where: Record<string, unknown>; is_active: boolean; label: string }[] = [
      {
        label: 'date_from in future => not active',
        is_active: false,
        where: {
          date_from: { [Op.gt]: now },
          is_active: { [Op.ne]: false }
        }
      },
      {
        label: 'date_to in past => not active',
        is_active: false,
        where: {
          date_to: { [Op.lt]: now },
          is_active: { [Op.ne]: false }
        }
      },
      {
        label: 'within window => active',
        is_active: true,
        where: {
          date_from: { [Op.lte]: now },
          date_to: { [Op.gte]: now },
          is_active: { [Op.ne]: true }
        }
      }
    ]

    for (const { where, is_active, label } of transitions) {
      let totalUpdated = 0
      let hasMore = true

      // Process in chunks: fetch matching IDs, then bulk-update by ID batch
      while (hasMore) {
        // Fetch a limited batch of IDs matching the transition rule
        const batch = await Popup.findAll({
          attributes: ['id'],
          where,
          limit: CHUNK_SIZE,
          raw: true
        })

        if (batch.length === 0) {
          hasMore = false
          break
        }

        const ids = batch.map((p) => p.id)

        // Bulk update only the fetched chunk by primary key
        const [affectedCount] = await Popup.update(
          {
            is_active,
          },
          { where: { id: { [Op.in]: ids } } }
        )

        totalUpdated += affectedCount

        // If fewer results than chunk size, no more rows to process
        if (batch.length < CHUNK_SIZE) hasMore = false
      }

      if (totalUpdated > 0) {
        Terminal.log(`${label}: ${totalUpdated} popup(s) updated`)
      }
    }

    Terminal.success('Popups is_active computation done')
  }
}

export const popupService = new PopupService()
