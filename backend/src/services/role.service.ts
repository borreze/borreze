import { Role } from '../models'
import { WhereOptions } from 'sequelize'
import { Pagination } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { RoleAttributes, RoleAttributesCreation, RoleAttributesUpdate } from '@brz/shared'
import { searchWhere } from '../utils/model.utils'
import { ROLE_CONSTRAINTS } from '../models/role.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'
import { validateAll } from '../utils/validation.utils'

export class RoleService {
  public async count(options?: { search?: string }): Promise<number> {
    const { search } = options || {}

    const where: WhereOptions = {
      ...searchWhere(ROLE_CONSTRAINTS, search)
    }

    const result = await Role.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string }, order: Order[] = [], pagination?: Pagination | null,): Promise<RoleAttributes[]> {
    const { search } = options || {}
    const { offset, limit } = pagination || paginationDefault()


    const where: WhereOptions = {
      ...searchWhere(ROLE_CONSTRAINTS, search)
    }

    const roles = await Role.findAll({ where, order, offset, limit })
    return roles
  }

  public async getById(id: number): Promise<RoleAttributes | null> {
    const where: WhereOptions = {
      id
    }

    const role = await Role.findOne({ where })
    if (!role) throw new NotFound('Role not found')
    return role
  }

  public async create(data: RoleAttributesCreation): Promise<RoleAttributes | null> {
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, ROLE_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return Role.create(data, { transaction })
    })
  }

  public async update(id: number, data: RoleAttributesUpdate): Promise<RoleAttributes | null> {
    const { valid, errors } = validateAll(data, ROLE_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const role = await Role.findByPk(id, { transaction })
      if (!role) throw new NotFound('Role not found')

      await role.update(data, { transaction })
      return role
    }).then(async (role) => {
      if (!role) return null
      return role
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await Role.destroy({ where: { id } })
    if (!result) throw new NotFound('Role not found')
    return result
  }
}

export const roleService = new RoleService()
