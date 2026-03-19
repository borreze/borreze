import { Schedule } from '../models'
import { WhereOptions } from 'sequelize'
import { Pagination } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { ScheduleAttributes, ScheduleAttributesCreation, ScheduleAttributesUpdate, ScheduleType } from '@brz/shared'
import { validateAll } from '../utils/model.utils'
import { SCHEDULE_CONSTRAINTS } from '../models/schedule.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'

export class ScheduleService {
  private filterType(type?: ScheduleType | null): WhereOptions {
    if (type) return { type }
    return {}
  }

  public async count(options?: { type?: ScheduleType | null }): Promise<number> {
    const { type } = options || {}

    const where: WhereOptions = {
      ...this.filterType(type),
    }

    const result = await Schedule.count({ where })
    return Number(result)
  }

  public async getAll(options?: { type?: ScheduleType | null }, order: Order[] = [], pagination?: Pagination | null): Promise<ScheduleAttributes[]> {
    const { type } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    const where: WhereOptions = {
      ...this.filterType(type),
    }

    const schedules = await Schedule.findAll({ where, order, offset, limit })
    return schedules
  }

  public async getById(id: number, options?: { type?: ScheduleType | null }): Promise<ScheduleAttributes | null> {
    const { type } = options || {}

    const where: WhereOptions = {
      ...this.filterType(type),
      id
    }

    const schedule = await Schedule.findOne({ where })
    if (!schedule) throw new NotFound('Schedule not found')
    return schedule
  }

  public async create(data: ScheduleAttributesCreation): Promise<ScheduleAttributes | null> {
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, SCHEDULE_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return Schedule.create(data, { transaction })
    })
  }

  public async update(id: number, data: ScheduleAttributesUpdate): Promise<ScheduleAttributes | null> {
    const { valid, errors } = validateAll(data, SCHEDULE_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const schedule = await Schedule.findByPk(id, { transaction })
      if (!schedule) throw new NotFound('Schedule not found')

      await schedule.update(data, { transaction })
      return schedule
    }).then(async (schedule) => {
      if (!schedule) return null
      return schedule
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await Schedule.destroy({ where: { id } })
    if (!result) throw new NotFound('Schedule not found')
    return result
  }
}

export const scheduleService = new ScheduleService()
