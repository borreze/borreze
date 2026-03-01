import { RequestHandler } from 'express'
import { userService } from '../services/user.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'

export class UserController {
  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req)

    const options = { search }

    const count = await userService.count(options)
    const pagination = paginate(page, limit, count)
    const data = await userService.getAll(options, order, pagination)
    res.json({ pagination, data, message: 'Users retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const user = await userService.getById(id)
    res.json({ data: user, message: 'User retrieved successfully' } as Return)
  }

  public create: RequestHandler = async (req, res) => {
    const user = await userService.create(req.body)

    res.status(201).json({ data: user, message: 'User created successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const user = await userService.update(id, req.body)
    res.status(200).json({ data: user, message: 'User updated successfully' } as Return)
  }

  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    await userService.delete(id)
    res.status(200).json({ message: 'User deleted successfully' } as Return)
  }
}

export const userController = new UserController()
