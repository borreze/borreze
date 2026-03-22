import { RequestHandler } from 'express'
import { scheduleService } from '../services/schedule.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'
import { Order, Pagination, ScheduleType } from '@brz/shared'

export class ScheduleController {
  public getByType: RequestHandler = async (req, res) => {
    const page = 1
    const limit = 99
    const type = String(req.params.type) as ScheduleType
    const options = { type }
    const order: Order[] = [['created_at', 'DESC']]
    const pagination: Pagination = { page, limit, total: Infinity }

    const data = await scheduleService.getAll(options, order, pagination)
    res.status(200).json({ data, message: 'Schedules retrieved successfully' } as Return)
  }

  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const type = String(req.query.type || 'published') as ScheduleType
    const order = parseOrder(req, [['created_at', 'DESC'], ['id', 'DESC']])

    const options = { type }

    const count = await scheduleService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await scheduleService.getAll(options, order, pagination)
    res.status(200).json({ pagination, data, message: 'Schedules retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const type = String(req.query.type) as ScheduleType

    const options = { type }

    const schedule = await scheduleService.getById(id, options)
    res.status(200).json({ data: schedule, message: 'Schedule retrieved successfully' } as Return)
  }

  public create: RequestHandler = async (req, res) => {
    const schedule = await scheduleService.create(req.body)

    res.status(201).json({ data: schedule, message: 'Schedule created successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const schedule = await scheduleService.update(id, req.body)
    res.status(200).json({ data: schedule, message: 'Schedule updated successfully' } as Return)
  }

  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    await scheduleService.delete(id)
    res.status(200).json({ message: 'Schedule deleted successfully' } as Return)
  }
}

export const scheduleController = new ScheduleController()
