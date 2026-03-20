import { HomeQuick } from '../models'
import { WhereOptions } from 'sequelize'
import { Pagination, UserAttributesPublic } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { HomeQuickAttributes, HomeQuickAttributesCreation, HomeQuickAttributesUpdate } from '@brz/shared'
import { searchWhere } from '../utils/model.utils'
import { HOME_QUICK_CONSTRAINTS } from '../models/homeQuick.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'
import { permissionCheck } from '../utils/auth.utils'
import { validateAll } from '../utils/validation.utils'

export class HomeQuickService {
  private filterIsVisible(is_visible?: boolean | null): WhereOptions {
    if (!is_visible) return {}
    return { is_visible }
  }

  public async count(options?: { search?: string, is_visible?: boolean | null }): Promise<number> {
    const { is_visible, search } = options || {}

    const where: WhereOptions = {
      ...this.filterIsVisible(is_visible),
      ...searchWhere(HOME_QUICK_CONSTRAINTS, search)
    }

    const result = await HomeQuick.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string; is_visible?: boolean | null }, order: Order[] = [], pagination?: Pagination | null, user?: UserAttributesPublic): Promise<HomeQuickAttributes[]> {
    const { is_visible, search } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    if (
      (!is_visible) // only allow non-published posts if allowed to
    ) {
      await permissionCheck(user, 'home-quick', 'read')
    }

    const where: WhereOptions = {
      ...this.filterIsVisible(is_visible),
      ...searchWhere(HOME_QUICK_CONSTRAINTS, search)
    }

    const homeQuicks = await HomeQuick.findAll({ where, order, offset, limit })
    return homeQuicks
  }

  public async getById(id: number, options?: { is_visible?: boolean | null }): Promise<HomeQuickAttributes | null> {
    const { is_visible } = options || {}

    const where: WhereOptions = {
      ...this.filterIsVisible(is_visible),
      id
    }

    const homequick = await HomeQuick.findOne({ where })
    if (!homequick) throw new NotFound('HomeQuick not found')
    return homequick
  }

  public async create(data: HomeQuickAttributesCreation): Promise<HomeQuickAttributes | null> {
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, HOME_QUICK_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return HomeQuick.create(data, { transaction })
    })
  }

  public async update(id: number, data: HomeQuickAttributesUpdate): Promise<HomeQuickAttributes | null> {
    const { valid, errors } = validateAll(data, HOME_QUICK_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const homequick = await HomeQuick.findByPk(id, { transaction })
      if (!homequick) throw new NotFound('HomeQuick not found')

      await homequick.update(data, { transaction })
      return homequick
    }).then(async (homequick) => {
      if (!homequick) return null
      return homequick
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await HomeQuick.destroy({ where: { id } })
    if (!result) throw new NotFound('HomeQuick not found')
    return result
  }
}

export const homeQuickService = new HomeQuickService()
