import { RequestHandler } from 'express'
import { roleService } from '../services/role.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'
import { Log } from '../utils/log.utils'

export class RoleController {
  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req, [['created_at', 'DESC'], ['id', 'DESC']])

    const options = { search }

    const count = await roleService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await roleService.getAll(options, order, pagination)
    res.status(200).json({ pagination, data, message: 'Roles retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const role = await roleService.getById(id)
    res.status(200).json({ data: role, message: 'Role retrieved successfully' } as Return)
  }

  public create: RequestHandler = async (req, res) => {
    const role = await roleService.create(req.body)

    Log.info(`Le rôle d'ID #${role?.id} a été créé`, req)
    res.status(201).json({ data: role, message: 'Role created successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const role = await roleService.update(id, req.body)
    Log.info(`Le rôle d'ID #${id} a été mis à jour`, req)
    res.status(200).json({ data: role, message: 'Role updated successfully' } as Return)
  }

  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    await roleService.delete(id)
    Log.info(`Le rôle d'ID #${id} a été supprimé`, req)
    res.status(200).json({ message: 'Role deleted successfully' } as Return)
  }
}

export const roleController = new RoleController()
