import { Category } from '../models'
import { Pagination } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { CategoryAttributes, CategoryAttributesCreation, CategoryAttributesUpdate } from '@brz/shared'
import { slugify } from '@brz/shared'
import { searchWhere, validateAll } from '../utils/model.utils'
import { CATEGORY_CONSTRAINTS } from '../models/category.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'
import { CategorizableType } from '../../../shared/src/types/categorizable.types'
import { Op, WhereOptions, literal } from 'sequelize'

export class CategoryService {
  private filterWhereOneFromType(type: CategorizableType | string | null = 'all'): WhereOptions {
    if (!type || type === 'all') return {}

    return {
      id: {
        [Op.in]: literal(`(
                  SELECT DISTINCT category_id
                  FROM categorizable
                  WHERE type = '${type}'
              )`)
      }
    }
  }

  public async count(options?: { search?: string, type?: CategorizableType | string | null }): Promise<number> {
    const { search, type } = options || {}

    const where: WhereOptions = {
      ...this.filterWhereOneFromType(type),
      ...searchWhere(CATEGORY_CONSTRAINTS, search)
    }

    const result = await Category.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string, type?: CategorizableType | string | null }, order: Order[] = [], pagination?: Pagination | null): Promise<CategoryAttributes[]> {
    const { search, type } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    const where: WhereOptions = {
      ...this.filterWhereOneFromType(type),
      ...searchWhere(CATEGORY_CONSTRAINTS, search)
    }

    const categories = await Category.findAll({ where, order, offset, limit })
    return categories
  }

  public async getById(id: number, options?: { type?: CategorizableType | string | null }): Promise<CategoryAttributes | null> {
    const { type } = options || {}

    const where: WhereOptions = {
      ...this.filterWhereOneFromType(type),
      id
    }

    const category = await Category.findOne({ where })
    if (!category) throw new NotFound('Category not found')
    return category
  }


  public async create(data: CategoryAttributesCreation): Promise<CategoryAttributes | null> {
    if (!data.slug) data.slug = slugify(data.name)
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, CATEGORY_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return Category.create(data, { transaction })
    })
  }

  public async update(id: number, data: CategoryAttributesUpdate): Promise<CategoryAttributes | null> {
    if (!data.slug) data.slug = slugify(data.name)

    const { valid, errors } = validateAll(data, CATEGORY_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const category = await Category.findByPk(id, { transaction })
      if (!category) throw new NotFound('Category not found')

      await category.update(data, { transaction })
      return category
    }).then(async (category) => {
      if (!category) return null
      return category
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await Category.destroy({ where: { id } })
    if (!result) throw new NotFound('Category not found')
    return result
  }
}

export const categoryService = new CategoryService()
