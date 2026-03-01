import { Log } from '../models'
import { LogAttributes, LogAttributesCreation } from '../types/models/log.types'
import { Transaction, WhereOptions } from 'sequelize'
import { Op } from 'sequelize'
import { Pagination } from '../types/utils/pagination.types'
import { Request } from 'express'
import { Order } from '../types/utils/request.types'
import { searchWhere, validateAll } from '../utils/model.utils'
import { LOG_CONSTRAINTS, LOG_RENTENTION_DAYS } from '../models/log.model'
import { NotFound } from '../exceptions/request.exception'
import { ValidationException } from '../exceptions/validation.exception'
import { sequelize } from '../config/database'
import { paginationDefault } from '../utils/pagination.utils'

export class LogService {
  public async count(options?: { search?: string }): Promise<number> {
    const { search } = options || {}

    const where: WhereOptions = {
      ...searchWhere(LOG_CONSTRAINTS, search)
    }

    const result = await Log.count({ where })
    return Number(result)
  }

  public async getAll(options: { search?: string }, order: Order[] = [], pagination?: Pagination | null): Promise<LogAttributes[]> {
    const { search } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    const where: WhereOptions = {
      ...searchWhere(LOG_CONSTRAINTS, search)
    }

    const logs = await Log.findAll({ where, order, offset, limit })
    return logs
  }

  public async getById(id: number): Promise<Log | null> {
    const log = await Log.findOne({ where: { id } })
    if (!log) throw new NotFound('Log not found')
    return log
  }

  // ? Main method to create a log entry
  // ? Should be called from anywhere in the application where logging is needed
  // ? Avoid meaningless logs by ensuring the message is clear and concise. Log only what is necessary.
  public async make(message: string, level: LogAttributesCreation['level'] = 'info', req?: Request): Promise<Log> {
    const data: LogAttributesCreation = {
      message,
      level,
    }

    if (req) {
      data.user_agent = req.headers['user-agent']
      data.ip_address = req.ip || req.connection.remoteAddress || ''
      data.user_id = Number(req?.params?.user_id || 0) || null
      data.context = {
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params
      }
    }

    const log = await this.create(data)

    return log
  }

  private async create(data: LogAttributesCreation): Promise<Log> {
    const { valid, errors } = validateAll(data, LOG_CONSTRAINTS)
    if (!valid) throw new ValidationException(errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return Log.create(data, { transaction })
    })
  }

  private async update(): Promise<Log | null> {
    // ! THIS METHOD SHOULD NEVER BE IMPLEMENTED
    // ! BEING ABLE TO UPDATE LOGS DEFEATS THE PURPOSE OF HAVING LOGS
    throw new Error('Method not implemented.')
  }

  private async delete(): Promise<Log | null> {
    // ! THIS METHOD SHOULD NEVER BE IMPLEMENTED
    // ! BEING ABLE TO DELETE LOGS DEFEATS THE PURPOSE OF HAVING LOGS
    throw new Error('Method not implemented.')
  }

  public async clear(): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - LOG_RENTENTION_DAYS)

    const result = await Log.destroy({
      where: {
        created_at: {
          [Op.lt]: cutoffDate,
        },
      },
    })

    return result
  }
}

export const logService = new LogService()
