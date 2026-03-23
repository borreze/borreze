import { RequestHandler } from 'express'
import { menuService } from '../services/menu.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'
import { Order, Pagination } from '@brz/shared'
import { filterMenusForUser } from '../utils/menu.utils'

export class MenuController {
  public getAllByScope: RequestHandler = async (req, res) => {
    const page = 1
    const limit = 99
    const order: Order[] = [['order', 'ASC'], ['id', 'DESC']]
    const scope = String(req.params.scope)
    const pagination: Pagination = { page, limit, total: Infinity }

    const options = { scope, is_visible: true, noParent: true }

    let data = await menuService.getAll(options, order, pagination, req?.user)
    if (scope === 'back-office') data = await filterMenusForUser(data, req?.user)
    res.status(200).json({ pagination, data, message: 'Menus retrieved successfully' } as Return)
  }

  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req, [['order', 'ASC'], ['id', 'DESC']])
    const is_visible = (req.query.is_visible === 'all') ? null : (req.query.is_visible !== undefined) ? (req.query.is_visible === 'true') : true

    const options = { search, is_visible }

    const count = await menuService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await menuService.getAll(options, order, pagination, req?.user)
    res.status(200).json({ pagination, data, message: 'Menus retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const is_visible = (req.query.is_visible === 'all') ? null : (req.query.is_visible !== undefined) ? (req.query.is_visible === 'true') : true

    const options = { is_visible }

    const menu = await menuService.getById(id, options)
    res.status(200).json({ data: menu, message: 'Menu retrieved successfully' } as Return)
  }

  public create: RequestHandler = async (req, res) => {
    const menu = await menuService.create(req.body)

    res.status(201).json({ data: menu, message: 'Menu created successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const menu = await menuService.update(id, req.body)
    res.status(200).json({ data: menu, message: 'Menu updated successfully' } as Return)
  }

  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    await menuService.delete(id)
    res.status(200).json({ message: 'Menu deleted successfully' } as Return)
  }
}

export const menuController = new MenuController()
