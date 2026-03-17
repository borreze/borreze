import { HomeQuick } from '../models'
import { WhereOptions } from 'sequelize'
import { Pagination } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { HomeQuickAttributes, HomeQuickAttributesCreation, HomeQuickAttributesUpdate } from '@brz/shared'
import { searchWhere, validateAll } from '../utils/model.utils'
import { HOME_QUICK_CONSTRAINTS } from '../models/homeQuick.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'

export class HomeQuickService {
  public async count(options?: { search?: string; }): Promise<number> {
    const { search } = options || {}

    const where: WhereOptions = {
      ...searchWhere(HOME_QUICK_CONSTRAINTS, search)
    }

    const result = await HomeQuick.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string; }, order: Order[] = [], pagination?: Pagination | null): Promise<HomeQuickAttributes[]> {
    const { search } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    const where: WhereOptions = {
      ...searchWhere(HOME_QUICK_CONSTRAINTS, search)
    }

    const homequicks = await HomeQuick.findAll({ where, order, offset, limit })
    return homequicks
  }

  public async getById(id: number): Promise<HomeQuickAttributes | null> {
    const where: WhereOptions = {
      id
    }

    const homequick = await HomeQuick.findOne({ where })
    if (!homequick) throw new NotFound('HomeQuick not found')
    return homequick
  }

  public async create(data: HomeQuickAttributesCreation): Promise<HomeQuickAttributes | null> {
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, HOME_QUICK_CONSTRAINTS)
    if (!valid) throw new ValidationException('Des champs sont manquants', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return HomeQuick.create(data, { transaction })
    })
  }

  public async update(id: number, data: HomeQuickAttributesUpdate): Promise<HomeQuickAttributes | null> {
    const { valid, errors } = validateAll(data, HOME_QUICK_CONSTRAINTS)
    if (!valid) throw new ValidationException('Des champs sont manquants', errors)

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

export const homequickService = new HomeQuickService()
