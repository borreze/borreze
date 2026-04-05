import { Category } from '../models'
import { CategorizableType, Pagination, PostType } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { CategoryAttributes, CategoryAttributesCreation, CategoryAttributesUpdate } from '@brz/shared'
import { slugify } from '@brz/shared'
import { isUnique, modelBuildWhere, searchWhere } from '../utils/model.utils'
import { CATEGORY_CONSTRAINTS } from '../models/category.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'
import { Op, WhereOptions, literal } from 'sequelize'
import { validateAll } from '../utils/validation.utils'

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

  private filterWhereOneFromPostType(type: PostType | string | null = null): WhereOptions {
    if (!type) return {}

    return {
      id: {
        [Op.in]: literal(`(
        SELECT DISTINCT c.category_id
        FROM categorizable c
        INNER JOIN post p ON p.id = c.categorizable_id
        WHERE c.type = 'post'
        AND p.type = '${type}'
      )`)
      }
    }
  }

  public async count(options?: { search?: string, type?: CategorizableType | string | null, post?: PostType | null }): Promise<number> {
    const { search, type, post } = options || {}

    const where = modelBuildWhere([
      this.filterWhereOneFromType(type),
      this.filterWhereOneFromPostType(post),
      searchWhere(CATEGORY_CONSTRAINTS, search)
    ])

    const result = await Category.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string, type?: CategorizableType | string | null, post?: PostType | null }, order: Order[] = [], pagination?: Pagination | null): Promise<CategoryAttributes[]> {
    const { search, type, post } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    const where = modelBuildWhere([
      this.filterWhereOneFromType(type),
      this.filterWhereOneFromPostType(post),
      searchWhere(CATEGORY_CONSTRAINTS, search)
    ])

    const categories = await Category.findAll({ where, order, offset, limit })
    return categories
  }

  public async getById(id: number, options?: { type?: CategorizableType | string | null, post?: PostType | null }): Promise<CategoryAttributes | null> {
    const { type, post } = options || {}

    const where = modelBuildWhere([
      this.filterWhereOneFromType(type),
      this.filterWhereOneFromPostType(post),
      { id }
    ])

    const category = await Category.findOne({ where })
    if (!category) throw new NotFound('Category not found')
    return category
  }


  public async create(data: CategoryAttributesCreation): Promise<CategoryAttributes | null> {
    if (!data.slug) data.slug = slugify(data.name)
    if (data.slug) data.slug = slugify(data.slug)
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, CATEGORY_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    const unique = await isUnique(Category, 'slug', data.slug)
    if (!unique) throw new ValidationException('Erreur sur les champs', [{ field: 'slug', message: 'Une catégorie avec ce slug existe déjà' }])

    return sequelize.transaction(async (transaction: Transaction) => {
      return Category.create(data, { transaction })
    })
  }

  public async update(id: number, data: CategoryAttributesUpdate): Promise<CategoryAttributes | null> {
    if (!data.slug) data.slug = slugify(data.name)
    if (data.slug) data.slug = slugify(data.slug)

    const { valid, errors } = validateAll(data, CATEGORY_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    const unique = await isUnique(Category, 'slug', data.slug, { excludeId: id })
    if (!unique) throw new ValidationException('Erreur sur les champs', [{ field: 'slug', message: 'Une catégorie avec ce slug existe déjà' }])

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
