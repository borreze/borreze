import { RequestHandler } from 'express'
import { popupService } from '../services/popup.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'

export class PopupController {
  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req, [['date_from', 'ASC'], ['created_at', 'DESC'], ['id', 'DESC']])
    const is_active = (req.query.is_active === 'all') ? null : (req.query.is_active !== undefined) ? (req.query.is_active === 'true') : true

    const options = { search, is_active }

    const count = await popupService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await popupService.getAll(options, order, pagination, req?.user)
    res.json({ pagination, data, message: 'Popups retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const is_active = (req.query.is_active === 'all') ? null : (req.query.is_active !== undefined) ? (req.query.is_active === 'true') : true

    const options = { is_active }

    const popup = await popupService.getById(id, options)
    res.json({ data: popup, message: 'Popup retrieved successfully' } as Return)
  }

  public create: RequestHandler = async (req, res) => {
    const popup = await popupService.create(req.body)

    res.status(201).json({ data: popup, message: 'Popup created successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const popup = await popupService.update(id, req.body)
    res.status(200).json({ data: popup, message: 'Popup updated successfully' } as Return)
  }

  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    await popupService.delete(id)
    res.status(200).json({ message: 'Popup deleted successfully' } as Return)
  }
}

export const popupController = new PopupController()
