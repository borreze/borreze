import { Post } from '../models'
import { col, literal, Op, WhereOptions } from 'sequelize'
import { Pagination, PostType } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { PostAttributes, PostAttributesCreation, PostAttributesUpdate, PostStatus } from '@brz/shared'
import { slugify } from '@brz/shared'
import { isUnique, modelBuildWhere, searchWhere } from '../utils/model.utils'
import { POST_CONSTRAINTS, POST_INCLUDE_DEFAULTS } from '../models/post.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { permissionCheck } from '../utils/auth.utils'
import { UserAttributesPublic } from '@brz/shared'
import { paginationDefault } from '@brz/shared'
import { Terminal } from '../utils/terminal.utils'
import { validateAll, validateOne } from '../utils/validation.utils'

export class PostService {
  private filterStatus(status?: PostStatus | 'all' | null): WhereOptions {
    if (status === 'all') return {}
    return { status: status ?? 'published' }
  }

  private filterDateInBetween(dateFrom?: Date | null, dateTo?: Date | null): WhereOptions {
    if (!dateFrom && !dateTo) return {}
    return {
      date_time: {
        [Op.between]: [dateFrom, dateTo]
      }
    }
  }

  private filterType(type?: PostType | null): WhereOptions {
    if (!type) return {}
    return { type }
  }

  private filterInFutureOnly(inFutureOnly?: boolean | null): WhereOptions {
    if (!inFutureOnly) return {}
    return {
      date_time: {
        [Op.gt]: new Date()
      }
    }
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

  public async count(options?: { search?: string, type?: PostType | null, status?: PostStatus | 'all' | null, dateFrom?: Date | null, dateTo?: Date | null, inFutureOnly?: boolean | null, categories?: number[] | null }): Promise<number> {
    const { status, search, categories, type, inFutureOnly, dateFrom, dateTo } = options || {}

    const where = modelBuildWhere([
      this.filterStatus(status),
      this.filterType(type),
      this.filterCategories(categories),
      this.filterInFutureOnly(inFutureOnly),
      this.filterDateInBetween(dateFrom, dateTo),
      searchWhere(POST_CONSTRAINTS, search),
    ])

    const result = await Post.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string, type?: PostType | null, status?: PostStatus | 'all' | null, dateFrom?: Date | null, dateTo?: Date | null, inFutureOnly?: boolean | null, categories?: number[] | null }, order: Order[] = [], pagination?: Pagination | null, user?: UserAttributesPublic): Promise<PostAttributes[]> {
    const { status, type, search, categories, inFutureOnly, dateFrom, dateTo } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    if (
      (status && status !== 'published') // only allow non-published posts if allowed to
    ) {
      await permissionCheck(user, 'post', 'read')
    }

    const where = modelBuildWhere([
      this.filterStatus(status),
      this.filterType(type),
      this.filterCategories(categories),
      this.filterInFutureOnly(inFutureOnly),
      this.filterDateInBetween(dateFrom, dateTo),
      searchWhere(POST_CONSTRAINTS, search),
    ])

    const posts = await Post.findAll({ where, order, offset, limit, include: POST_INCLUDE_DEFAULTS })
    return posts
  }

  public async getById(id: number, options?: { status?: PostStatus | 'all' | null, dateFrom?: Date | null, dateTo?: Date | null, inFutureOnly?: boolean | null, type?: PostType | null }): Promise<PostAttributes | null> {
    const { status, type, inFutureOnly, dateFrom, dateTo } = options || {}

    const where = modelBuildWhere([
      this.filterStatus(status),
      this.filterType(type),
      this.filterInFutureOnly(inFutureOnly),
      this.filterDateInBetween(dateFrom, dateTo),
      { id }
    ])

    const post = await Post.findOne({ where, include: POST_INCLUDE_DEFAULTS })
    if (!post) throw new NotFound('Post not found')
    return post
  }

  public async getBySlug(slug: string, options?: { status?: PostStatus | 'all' | null, dateFrom?: Date | null, dateTo?: Date | null, inFutureOnly?: boolean | null, type?: PostType | null }): Promise<PostAttributes | null> {
    const { status, type, inFutureOnly, dateFrom, dateTo } = options || {}

    const where = modelBuildWhere([
      this.filterStatus(status),
      this.filterType(type),
      this.filterInFutureOnly(inFutureOnly),
      this.filterDateInBetween(dateFrom, dateTo),
      { slug }
    ])

    const post = await Post.findOne({ where, include: POST_INCLUDE_DEFAULTS })
    if (!post) throw new NotFound('Post not found')
    return post
  }

  public async create(data: PostAttributesCreation): Promise<PostAttributes | null> {
    if (!data.slug) data.slug = slugify(data.title)
    if (data.slug) data.slug = slugify(data.slug)
    if (!data.published_at && data.status === 'published') data.published_at = new Date()
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, POST_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    const unique = await isUnique(Post, 'slug', data.slug)
    if (!unique) throw new ValidationException('Erreur sur les champs', [{ field: 'slug', message: 'Un contenu avec ce slug existe déjà' }])

    return sequelize.transaction(async (transaction: Transaction) => {
      return Post.create(data, { transaction, include: POST_INCLUDE_DEFAULTS })
    })
  }

  public async update(id: number, data: PostAttributesUpdate): Promise<PostAttributes | null> {
    if (!data.slug) data.slug = slugify(data.title)
    if (data.slug) data.slug = slugify(data.slug)
    if (!data.published_at && data.status === 'published') data.published_at = new Date()

    const { valid, errors } = validateAll(data, POST_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    const unique = await isUnique(Post, 'slug', data.slug, { excludeId: id })
    if (!unique) throw new ValidationException('Erreur sur les champs', [{ field: 'slug', message: 'Une actualité avec ce slug existe déjà' }])

    return sequelize.transaction(async (transaction: Transaction) => {
      const post = await Post.findByPk(id, { transaction, include: POST_INCLUDE_DEFAULTS })
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
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const post = await Post.findByPk(id, { transaction })
      if (!post) throw new NotFound('Post not found')
      if (post.unpublishable && status !== 'published') throw new ValidationException('Ce contenu ne peut pas être dépublié')

      await post.update({ status, published_at: status === 'published' ? new Date() : undefined }, { transaction })
      return post
    }).then(async (post) => {
      if (!post) return null
      return post
    })
  }

  public async updateCategories(id: number, ids: number[]): Promise<PostAttributes | null> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const post = await Post.findByPk(id, { transaction })
      if (!post) throw new NotFound('Post not found')

      await post.setCategories(ids, { transaction })

      return post
    }).then(async (post) => {
      if (!post) return null
      return post
    })
  }

  public async delete(id: number): Promise<number> {
    const post = await Post.findByPk(id)
    if (!post) throw new NotFound('Post not found')
    if (post.deletable === false) throw new ValidationException('Ce contenu ne peut pas être supprimé')

    const result = await Post.destroy({ where: { id, deletable: true } }) // only delete if deletable is true
    if (!result) throw new NotFound('Post not found')
    return result
  }

  /**
   * Computes and updates post latitude and longitude based on address.
   *
   * Rules:
   * - If address is not empty, geocode it to get lat/long
   * - If address is empty, set lat/long to null
   *
   * Processes updates in chunks to avoid long-running locks on the DB.
   */
  public async computeLocation(): Promise<void> {
    const CHUNK_SIZE = 50 // lower than status because of external API calls
    const API_URL = 'https://api-adresse.data.gouv.fr/search'

    Terminal.info('Computing posts locations...')

    let offset = 0
    let updated = 0
    let cleared = 0
    let failed = 0

    // 1. Clear lat/lng for posts with empty address
    const [clearedCount] = await Post.update(
      { latitude: null, longitude: null },
      {
        where: {
          [Op.and]: [
            { [Op.or]: [{ address: null }, { address: '' }] },
            {
              [Op.or]: [
                { latitude: { [Op.ne]: null } },
                { longitude: { [Op.ne]: null } }
              ]
            }
          ]
        }
      }
    )
    cleared = clearedCount

    // 2. Geocode posts with address but missing or outdated coordinates
    let hasMore = true

    while (hasMore) {
      const batch = await Post.findAll({
        attributes: ['id', 'address'],
        where: {
          address: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] },
          [Op.or]: [
            { latitude: null },
            { longitude: null }
          ]
        },
        limit: CHUNK_SIZE,
        offset,
        raw: true
      })

      if (batch.length === 0) {
        hasMore = false
        break
      }

      for (const post of batch) {
        try {
          const res = await fetch(`${API_URL}?q=${encodeURIComponent(post.address!)}&limit=1`)
          if (!res.ok) {
            Terminal.warn(`Geocoding API error ${res.status} for post #${post.id}`)
            failed++
            continue
          }

          const data = await res.json()
          const feature = data.features?.[0]

          if (!feature) {
            Terminal.warn(`No geocoding result for post #${post.id} (address: "${post.address}")`)
            failed++
            continue
          }

          const [longitude, latitude] = feature.geometry.coordinates

          await Post.update(
            { latitude, longitude },
            { where: { id: post.id } }
          )

          updated++
        } catch (err) {
          Terminal.warn(`Geocoding failed for post #${post.id}: ${(err as Error).message}`)
          failed++
        }
      }

      if (batch.length < CHUNK_SIZE) hasMore = false
      else offset += CHUNK_SIZE
    }

    Terminal.log(`Locations cleared: ${cleared}, geocoded: ${updated}, failed: ${failed}`)
    Terminal.success('Posts locations computation done')
  }

  /**
   * Computes and updates post statuses based on schedule_start and schedule_end dates.
   *
   * Rules:
   * - schedule_start in the future              => archived (not yet visible)
   * - schedule_end in the past                  => archived (expired)
   * - schedule_start in the past AND end future => published (within window)
   *
   * Processes updates in chunks to avoid long-running locks on the DB.
   */
  public async computeStatus(): Promise<void> {
    const CHUNK_SIZE = 500

    Terminal.info('Computing posts statuses...')

    const now = new Date()

    // Define each transition rule: a WHERE clause => target status
    const transitions: { where: Record<string, unknown>, status: PostStatus, label: string }[] = [
      {
        label: 'schedule_start in future => archived',
        status: 'archived',
        where: {
          schedule_start: { [Op.gt]: now },
          status: { [Op.ne]: 'archived' },
          unpublishable: { [Op.ne]: true }
        }
      },
      {
        label: 'schedule_end in past => archived',
        status: 'archived',
        where: {
          schedule_end: { [Op.lt]: now },
          status: { [Op.ne]: 'archived' },
          unpublishable: { [Op.ne]: true }
        }
      },
      {
        label: 'within schedule window => published',
        status: 'published',
        where: {
          schedule_start: { [Op.lte]: now },
          schedule_end: { [Op.gte]: now, [Op.gt]: col('schedule_start') }, // ensure end is after start
          status: { [Op.ne]: 'published' },
          unpublishable: { [Op.ne]: true }
        }
      }
    ]

    for (const { where, status, label } of transitions) {
      let totalUpdated = 0
      let hasMore = true

      // Process in chunks: fetch matching IDs, then bulk-update by ID batch
      while (hasMore) {
        // Fetch a limited batch of IDs matching the transition rule
        const batch = await Post.findAll({
          attributes: ['id'],
          where,
          limit: CHUNK_SIZE,
          raw: true
        })

        if (batch.length === 0) {
          hasMore = false
          break
        }

        const ids = batch.map((p) => p.id)

        // Bulk update only the fetched chunk by primary key
        const [affectedCount] = await Post.update(
          {
            status,
            published_at: status === 'published' ? new Date() : undefined // set published_at when publishing, clear when archiving
          },
          { where: { id: { [Op.in]: ids } } }
        )

        totalUpdated += affectedCount

        // If fewer results than chunk size, no more rows to process
        if (batch.length < CHUNK_SIZE) hasMore = false
      }

      if (totalUpdated > 0) {
        Terminal.log(`${label}: ${totalUpdated} post(s) updated`)
      }
    }

    Terminal.success('Posts statuses computation done')
  }
}

export const postService = new PostService()
