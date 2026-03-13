import { User } from '../models'
import { WhereOptions } from 'sequelize'
import { Pagination } from '@brz/shared'
import { Transaction } from 'sequelize'
import { UserStatus } from '@brz/shared'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { Op } from 'sequelize'
import { UserAttributesCreation } from '@brz/shared'
import { UserAttributesUpdate } from '@brz/shared'
import { UserAttributes } from '@brz/shared'
import { searchWhere, validateAll } from '../utils/model.utils'
import { USER_CONSTRAINTS, USER_INCLUDE_DEFAULTS, USER_ROLE_ID_DEFAULT } from '../models/user.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { hashPassword, isHash, isStrongPassword } from '../utils/auth.utils'
import { paginationDefault } from '../utils/pagination.utils'

export class UserService {
  private filterStatus(status?: UserStatus | 'all' | null): WhereOptions {
    if (status === 'all') return {}
    return { status: status ?? 'active' }
  }

  public async count(options?: { search?: string; status?: UserStatus }): Promise<number> {
    const { search, status } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
      ...searchWhere(USER_CONSTRAINTS, search)
    }

    const result = await User.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string; status?: UserStatus }, order: Order[] = [], pagination?: Pagination | null): Promise<UserAttributes[]> {
    const { search, status } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    const where: WhereOptions = {
      ...this.filterStatus(status),
      ...searchWhere(USER_CONSTRAINTS, search)
    }

    const users = await User.findAll({ where, order, offset, limit, include: USER_INCLUDE_DEFAULTS })
    return users
  }

  public async getByEmailOrUsername(emailOrUsername: string, options?: { status?: UserStatus, throwError?: boolean }): Promise<UserAttributes | null> {
    const { status, throwError } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
    }

    const user = await User.findOne({
      where: {
        ...where,
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    })
    if (!user) {
      if (throwError) throw new NotFound('User not found')
      return null
    }
    return user
  }

  public async getByUsername(username: string, options?: { status?: UserStatus }): Promise<UserAttributes | null> {
    const { status } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
      username
    }

    const user = await User.findOne({ where, include: USER_INCLUDE_DEFAULTS })
    if (!user) throw new NotFound('User not found')
    return user
  }

  public async getByEmail(email: string, options?: { status?: UserStatus }): Promise<UserAttributes | null> {
    const { status } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
      email
    }

    const user = await User.findOne({ where, include: USER_INCLUDE_DEFAULTS })
    if (!user) throw new NotFound('User not found')
    return user
  }

  public async getById(id: number, options?: { status?: UserStatus }): Promise<UserAttributes | null> {
    const { status } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
      id
    }

    const user = await User.findOne({ where, include: USER_INCLUDE_DEFAULTS })
    if (!user) throw new NotFound('User not found')
    return user
  }

  public async create(data: UserAttributesCreation): Promise<UserAttributes> {
    if (!data.role_id) data.role_id = USER_ROLE_ID_DEFAULT

    const { valid, errors } = validateAll(data, USER_CONSTRAINTS)
    if (!valid) throw new ValidationException(errors)

    if (!data.password || !isStrongPassword(data.password)) throw new ValidationException([{ field: 'password', message: 'Password is not strong enough' }])

    if (data.password && !isHash(data.password)) {
      data.password = await hashPassword(data.password)
    }

    return sequelize.transaction(async (transaction: Transaction) => {
      return User.create(data, { transaction, include: USER_INCLUDE_DEFAULTS })
    })
  }

  public async update(id: number, data: UserAttributesUpdate): Promise<UserAttributes | null> {
    const { valid, errors } = validateAll(data, USER_CONSTRAINTS)
    if (!valid) throw new ValidationException(errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const user = await User.findByPk(id, { transaction, include: USER_INCLUDE_DEFAULTS })
      if (!user) return null

      await user.update(data, { transaction })
      return user
    }).then(async (user) => {
      if (!user) return null
      return user
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await User.destroy({ where: { id } })
    if (!result) throw new NotFound('User not found')
    return result
  }
}

export const userService = new UserService()
