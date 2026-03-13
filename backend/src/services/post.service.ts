import { Post } from '../models'
import { literal, Op, WhereOptions } from 'sequelize'
import { Pagination } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { PostAttributes, PostAttributesCreation, PostAttributesUpdate, PostStatus } from '@brz/shared'
import { slugify } from '../utils/model.utils'
import { searchWhere, validateAll, validateOne } from '../utils/model.utils'
import { POST_CONSTRAINTS, POST_INCLUDE_DEFAULTS } from '../models/post.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { permissionCheck } from '../utils/auth.utils'
import { UserAttributesPublic } from '@brz/shared'
import { paginationDefault } from '../utils/pagination.utils'

export class PostService {
  private filterStatus(status?: PostStatus | 'all' | null): WhereOptions {
    if (status === 'all') return {}
    return { status: status ?? 'published' }
  }

  private filterCategories(categories?: number[] | null): WhereOptions {
    if (!categories || categories.length === 0) return {}

    return {
      id: {
        [Op.in]: literal(`(
                SELECT DISTINCT categorizable_id
                FROM categorizable
                WHERE type = 'post'
                AND category_id IN (${categories.join(',')})
            )`)
      }
    }
  }

  public async count(options?: { search?: string; status?: PostStatus | 'all' | null, categories?: number[] | null }): Promise<number> {
    const { status, search, categories } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
      ...this.filterCategories(categories),
      ...searchWhere(POST_CONSTRAINTS, search)
    }

    const result = await Post.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string; status?: PostStatus | 'all' | null, categories?: number[] | null }, order: Order[] = [], pagination?: Pagination | null, user?: UserAttributesPublic): Promise<PostAttributes[]> {
    const { status, search, categories } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    if (
      (status && status !== 'published') // only allow non-published posts if allowed to
    ) {
      await permissionCheck(user, 'post', 'read')
    }

    const where: WhereOptions = {
      ...this.filterStatus(status),
      ...this.filterCategories(categories),
      ...searchWhere(POST_CONSTRAINTS, search)
    }

    const posts = await Post.findAll({ where, order, offset, limit, include: POST_INCLUDE_DEFAULTS })
    return posts
  }

  public async getById(id: number, options?: { status?: PostStatus | 'all' | null }): Promise<PostAttributes | null> {
    const { status } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
      id
    }

    const post = await Post.findOne({ where, include: POST_INCLUDE_DEFAULTS })
    if (!post) throw new NotFound('Post not found')
    return post
  }

  public async getBySlug(slug: string, options?: { status?: PostStatus | 'all' | null }): Promise<PostAttributes | null> {
    const { status } = options || {}

    const where: WhereOptions = {
      ...this.filterStatus(status),
      slug
    }

    const post = await Post.findOne({ where, include: POST_INCLUDE_DEFAULTS })
    if (!post) throw new NotFound('Post not found')
    return post
  }

  public async create(data: PostAttributesCreation): Promise<PostAttributes | null> {
    if (!data.slug) data.slug = slugify(data.title)

    const { valid, errors } = validateAll(data, POST_CONSTRAINTS)
    if (!valid) throw new ValidationException(errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return Post.create(data, { transaction, include: POST_INCLUDE_DEFAULTS })
    })
  }

  public async update(id: number, data: PostAttributesUpdate): Promise<PostAttributes | null> {
    if (!data.slug) data.slug = slugify(data.title)

    const { valid, errors } = validateAll(data, POST_CONSTRAINTS)
    if (!valid) throw new ValidationException(errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const post = await Post.findByPk(id, { transaction })
      if (!post) throw new NotFound('Post not found')

      await post.update(data, { transaction })
      return post
    }).then(async (post) => {
      if (!post) return null
      return post
    })
  }

  public async updateStatus(id: number, status: PostStatus): Promise<PostAttributes | null> {
    const { valid, errors } = validateOne('status', status, POST_CONSTRAINTS)
    if (!valid) throw new ValidationException(errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const post = await Post.findByPk(id, { transaction })
      if (!post) throw new NotFound('Post not found')

      await post.update({ status, published_at: status === 'published' ? new Date() : undefined }, { transaction })
      return post
    }).then(async (post) => {
      if (!post) return null
      return post
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await Post.destroy({ where: { id } })
    if (!result) throw new NotFound('Post not found')
    return result
  }
}

export const postService = new PostService()
