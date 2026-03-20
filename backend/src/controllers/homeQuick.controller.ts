import { RequestHandler } from 'express'
import { homeQuickService } from '../services/homeQuick.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'

export class HomeQuickController {
  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req, [['order', 'ASC']])
    const is_visible = (req.query.is_visible === 'all') ? null : (req.query.is_visible !== undefined) ? (req.query.is_visible === 'true') : true

    const options = { search, is_visible }

    const count = await homeQuickService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await homeQuickService.getAll(options, order, pagination, req?.user)
    res.json({ pagination, data, message: 'HomeQuicks retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const is_visible = (req.query.is_visible === 'all') ? null : (req.query.is_visible !== undefined) ? (req.query.is_visible === 'true') : true

    const options = { is_visible }

    const homequick = await homeQuickService.getById(id, options)
    res.json({ data: homequick, message: 'HomeQuick retrieved successfully' } as Return)
  }

  public create: RequestHandler = async (req, res) => {
    const homequick = await homeQuickService.create(req.body)

    res.status(201).json({ data: homequick, message: 'HomeQuick created successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const homequick = await homeQuickService.update(id, req.body)
    res.status(200).json({ data: homequick, message: 'HomeQuick updated successfully' } as Return)
  }

  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    await homeQuickService.delete(id)
    res.status(200).json({ message: 'HomeQuick deleted successfully' } as Return)
  }
}

export const homeQuickController = new HomeQuickController()
