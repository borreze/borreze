import { User } from '../models'
import { WhereOptions } from 'sequelize'
import { isPasswordStrong, Pagination, USER_ROLE_ID_DEFAULT } from '@brz/shared'
import { Transaction } from 'sequelize'
import { UserStatus } from '@brz/shared'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { Op } from 'sequelize'
import { UserAttributesCreation } from '@brz/shared'
import { UserAttributesUpdate } from '@brz/shared'
import { UserAttributes } from '@brz/shared'
import { isUnique, searchWhere } from '../utils/model.utils'
import { USER_CONSTRAINTS, USER_INCLUDE_DEFAULTS } from '../models/user.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { hashPassword, isHash } from '../utils/auth.utils'
import { paginationDefault } from '@brz/shared'
import { validateAll, validateOne } from '../utils/validation.utils'

export class UserService {
  private filterStatus(status?: UserStatus | 'all' | null): WhereOptions {
    if (status === 'all') return {}
    return { status: status ?? 'active' }
  }

  public async count(options?: { search?: string, status?: UserStatus | 'all' | null }): Promise<number> {
    const { search, status } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
      ...searchWhere(USER_CONSTRAINTS, search)
    }

    const result = await User.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string, status?: UserStatus | 'all' | null }, order: Order[] = [], pagination?: Pagination | null): Promise<UserAttributes[]> {
    const { search, status } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    const where: WhereOptions = {
      ...this.filterStatus(status),
      ...searchWhere(USER_CONSTRAINTS, search)
    }

    const users = await User.findAll({ where, order, offset, limit, include: USER_INCLUDE_DEFAULTS })
    return users
  }

  public async getByEmailOrUsername(emailOrUsername: string, options?: { status?: UserStatus | 'all' | null, throwError?: boolean }): Promise<UserAttributes | null> {
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

  public async getByUsername(username: string, options?: { status?: UserStatus | 'all' | null }): Promise<UserAttributes | null> {
    const { status } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
      username
    }

    const user = await User.findOne({ where, include: USER_INCLUDE_DEFAULTS })
    if (!user) throw new NotFound('User not found')
    return user
  }

  public async getByEmail(email: string, options?: { status?: UserStatus | 'all' | null }): Promise<UserAttributes | null> {
    const { status } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
      email
    }

    const user = await User.findOne({ where, include: USER_INCLUDE_DEFAULTS })
    if (!user) throw new NotFound('User not found')
    return user
  }

  public async getById(id: number, options?: { status?: UserStatus | 'all' | null }): Promise<UserAttributes | null> {
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
    delete data.id // ensure id is not set
    if (data.password) data.password = await hashPassword(data.password)

    const { valid, errors } = validateAll(data, USER_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    const uniqueEmail = await isUnique(User, 'email', data.email)
    if (!uniqueEmail) throw new ValidationException('Erreur sur les champs', [{ field: 'email', message: 'Un utilisateur avec cet e-mail existe déjà' }])
    const uniqueUsername = await isUnique(User, 'username', data.username)
    if (!uniqueUsername) throw new ValidationException('Erreur sur les champs', [{ field: 'username', message: 'Un utilisateur avec ce nom d\'utilisateur existe déjà' }])

    if (!data.password || !isPasswordStrong(data.password)) throw new ValidationException('Erreur sur les champs', [{ field: 'password', message: 'Le mot de passe n\'est pas assez fort' }])

    if (data.password && !isHash(data.password)) {
      data.password = await hashPassword(data.password)
    }

    return sequelize.transaction(async (transaction: Transaction) => {
      return User.create(data, { transaction, include: USER_INCLUDE_DEFAULTS })
    })
  }

  public async update(id: number, data: UserAttributesUpdate): Promise<UserAttributes | null> {
    if (data.password) data.password = await hashPassword(data.password)

    const { valid, errors } = validateAll(data, USER_CONSTRAINTS, ['password'])
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    const uniqueEmail = await isUnique(User, 'email', data.email, { excludeId: id })
    if (!uniqueEmail) throw new ValidationException('Erreur sur les champs', [{ field: 'email', message: 'Un utilisateur avec cet e-mail existe déjà' }])
    const uniqueUsername = await isUnique(User, 'username', data.username, { excludeId: id })
    if (!uniqueUsername) throw new ValidationException('Erreur sur les champs', [{ field: 'username', message: 'Un utilisateur avec ce nom d\'utilisateur existe déjà' }])

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

  public async updateStatus(id: number, status: UserStatus): Promise<UserAttributes | null> {
    const { valid, errors } = validateOne('status', status, USER_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const user = await User.findByPk(id, { transaction })
      if (!user) throw new NotFound('User not found')

      await user.update({ status }, { transaction })
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
