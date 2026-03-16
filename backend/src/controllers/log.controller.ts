import { RequestHandler } from 'express'
import { logService } from '../services/log.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'

export class LogController {
  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req)

    const options = { search }

    const count = await logService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await logService.getAll(options, order, pagination)
    res.json({ pagination, data, message: 'Logs retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const log = await logService.getById(id)
    res.json({ data: log, message: 'Log retrieved successfully' } as Return)
  }

  public clear: RequestHandler = async (req, res) => {

    const deletedCount = await logService.clear()
    res.json({ message: `Cleared ${deletedCount} logs older than retention period` } as Return)
  }
}

export const logController = new LogController()
