import { Menu } from '../models'
import { WhereOptions } from 'sequelize'
import { Pagination, UserAttributesPublic } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { MenuAttributes, MenuAttributesCreation, MenuAttributesUpdate } from '@brz/shared'
import { modelBuildWhere, searchWhere } from '../utils/model.utils'
import { MENU_CONSTRAINTS, MENU_INCLUDE_DEFAULTS } from '../models/menu.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'
import { userCheck } from '../utils/auth.utils'
import { validateAll } from '../utils/validation.utils'

export class MenuService {
  private filterIsVisible(is_visible?: boolean | null): WhereOptions {
    if (!is_visible) return {}
    return { is_visible }
  }

  private filterScope(scope?: string | null): WhereOptions {
    if (!scope) return {}
    return { scope }
  }

  private filterNoParent(noParent?: boolean | null): WhereOptions {
    if (!noParent) return {}
    return { parent_id: null }
  }

  public async count(options?: { search?: string, is_visible?: boolean | null, noParent?: boolean | null, scope?: string | null }): Promise<number> {
    const { is_visible, search, noParent, scope } = options || {}

    const where = modelBuildWhere([
      this.filterIsVisible(is_visible),
      this.filterScope(scope),
      this.filterNoParent(noParent),
      searchWhere(MENU_CONSTRAINTS, search)
    ])

    const result = await Menu.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string, is_visible?: boolean | null, noParent?: boolean | null, scope?: string | null }, order: Order[] = [], pagination?: Pagination | null, user?: UserAttributesPublic): Promise<MenuAttributes[]> {
    const { is_visible, search, noParent, scope } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    if (
      (scope && scope !== 'front-office') || // only allow non-front-office menus if allowed to
      (!is_visible) // only allow non-published menus if allowed to
    ) {
      userCheck(user)
    }

    const where = modelBuildWhere([
      this.filterIsVisible(is_visible),
      this.filterScope(scope),
      this.filterNoParent(noParent),
      searchWhere(MENU_CONSTRAINTS, search)
    ])

    const menus = await Menu.findAll({ where, order, offset, limit, include: MENU_INCLUDE_DEFAULTS })
    return menus
  }

  public async getById(id: number, options?: { is_visible?: boolean | null, noParent?: boolean | null, scope?: string | null }): Promise<MenuAttributes | null> {
    const { is_visible, scope, noParent } = options || {}

    const where = modelBuildWhere([
      this.filterIsVisible(is_visible),
      this.filterScope(scope),
      this.filterNoParent(noParent),
      { id }
    ])

    const menu = await Menu.findOne({ where, include: MENU_INCLUDE_DEFAULTS })
    if (!menu) throw new NotFound('Menu not found')
    return menu
  }

  public async create(data: MenuAttributesCreation): Promise<MenuAttributes | null> {
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, MENU_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return Menu.create(data, { transaction, include: MENU_INCLUDE_DEFAULTS })
    })
  }

  public async update(id: number, data: MenuAttributesUpdate): Promise<MenuAttributes | null> {
    const { valid, errors } = validateAll(data, MENU_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const menu = await Menu.findByPk(id, { transaction, include: MENU_INCLUDE_DEFAULTS })
      if (!menu) throw new NotFound('Menu not found')

      await menu.update(data, { transaction })
      return menu
    }).then(async (menu) => {
      if (!menu) return null
      return menu
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await Menu.destroy({ where: { id } })
    if (!result) throw new NotFound('Menu not found')
    return result
  }
}

export const menuService = new MenuService()
