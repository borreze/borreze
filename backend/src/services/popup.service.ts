import { Popup } from '../models'
import { WhereOptions } from 'sequelize'
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
      (!is_active) // only allow non-published posts if allowed to
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
}

export const popupService = new PopupService()
