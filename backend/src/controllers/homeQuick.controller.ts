import { RequestHandler } from 'express'
import { homequickService } from '../services/homeQuick.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'
import { BadRequest } from '../exceptions/request.exception'

export class HomeQuickController {
  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req, [['order', 'ASC']])

    if (!req.query.is_visible) throw new BadRequest('is_visible query parameter is required')
    const is_visible = String(req.query.is_visible) === 'all' ? null : (req.query.is_visible === 'true')

    const options = { search, is_visible }

    const count = await homequickService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await homequickService.getAll(options, order, pagination, req?.user)
    res.json({ pagination, data, message: 'HomeQuicks retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    if (!req.query.is_visible) throw new BadRequest('is_visible query parameter is required')
    const is_visible = String(req.query.is_visible) === 'all' ? null : (req.query.is_visible === 'true')

    const options = { is_visible }

    const homequick = await homequickService.getById(id, options)
    res.json({ data: homequick, message: 'HomeQuick retrieved successfully' } as Return)
  }

  public create: RequestHandler = async (req, res) => {
    const homequick = await homequickService.create(req.body)

    res.status(201).json({ data: homequick, message: 'HomeQuick created successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const homequick = await homequickService.update(id, req.body)
    res.status(200).json({ data: homequick, message: 'HomeQuick updated successfully' } as Return)
  }

  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    await homequickService.delete(id)
    res.status(200).json({ message: 'HomeQuick deleted successfully' } as Return)
  }
}

export const homeQuickController = new HomeQuickController()
