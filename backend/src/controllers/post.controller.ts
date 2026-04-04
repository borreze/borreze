import { RequestHandler } from 'express'
import { postService } from '../services/post.service'
import { Return } from '../types/utils/api.types'
import { parseArrayInteger, parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'
import { PostStatus } from '@brz/shared'
import { Order } from '@brz/shared'
import { Pagination } from '@brz/shared'
import { Log } from '../utils/log.utils'
import { PostType } from '@brz/shared'

export class PostController {
  public getRecents: RequestHandler<{ type: string }> = async (req, res) => {
    const page = 1
    const limit = 3
    const type = String(req.params.type || 'page') as PostType
    const options = { status: 'published' as PostStatus, type }
    const order: Order[] = [['published_at', 'DESC'], ['date_time', 'ASC'], ['created_at', 'DESC']]
    const pagination: Pagination = { page, limit, total: Infinity }

    const data = await postService.getAll(options, order, pagination, req?.user)
    res.status(200).json({ data, message: 'Posts retrieved successfully' } as Return)
  }

  public getFuture: RequestHandler<{ type: string }> = async (req, res) => {
    const page = 1
    const limit = 3
    const type = String(req.params.type || 'page') as PostType
    const options = { status: 'published' as PostStatus, type, inFutureOnly: true }
    const order: Order[] = [['date_time', 'ASC'], ['created_at', 'DESC']]
    const pagination: Pagination = { page, limit, total: Infinity }

    const data = await postService.getAll(options, order, pagination, req?.user)
    res.status(200).json({ data, message: 'Posts retrieved successfully' } as Return)
  }

  public getAll: RequestHandler<{ type: string }> = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const status = String(req.query.status || 'published') as PostStatus | 'all'
    const type = String(req.params.type || 'page') as PostType
    const dateFrom = req.query.dateFrom ? new Date(String(req.query.dateFrom)) : null
    const dateTo = req.query.dateTo ? new Date(String(req.query.dateTo)) : null
    const order = parseOrder(req, [['date_time', 'ASC'], ['created_at', 'DESC'], ['id', 'DESC']])
    const categories = parseArrayInteger(req.query.categories as Array<string>)

    const options = { search, status, categories, type, dateFrom, dateTo }

    const count = await postService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await postService.getAll(options, order, pagination, req?.user)
    res.status(200).json({ pagination, data, message: 'Posts retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ type: string, id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const status = String(req.query.status || 'published') as PostStatus | 'all'
    const type = String(req.params.type || 'page') as PostType

    const options = { status, type }

    const post = await postService.getById(id, options)
    res.status(200).json({ data: post, message: 'Post retrieved successfully' } as Return)
  }

  public getBySlug: RequestHandler<{ type: string, slug: string }> = async (req, res) => {
    const slug = String(req.params.slug)
    const type = String(req.params.type || 'page') as PostType

    const options = { status: 'published' as PostStatus, type }

    const post = await postService.getBySlug(slug, options)
    res.status(200).json({ data: post, message: 'Post retrieved successfully' } as Return)
  }

  public create: RequestHandler<{ type: string }> = async (req, res) => {
    const type = String(req.params.type || 'page') as PostType

    const post = await postService.create({ ...req.body, type })

    Log.info(`Le post de type ${type} et d'ID #${post?.id} a été créée`, req)
    res.status(201).json({ data: post, message: 'Post created successfully' } as Return)
  }

  public update: RequestHandler<{ type: string, id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const type = String(req.params.type || 'page') as PostType

    const post = await postService.update(id, { ...req.body, type })
    Log.info(`Le post de type ${type} et d'ID #${id} a été mise à jour`, req)
    res.status(200).json({ data: post, message: 'Post updated successfully' } as Return)
  }

  public updateStatus: RequestHandler<{ type: string, id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const type = String(req.params.type || 'page') as PostType

    const { status } = req.body

    const post = await postService.updateStatus(id, status)
    Log.info(`Le statut du post de type ${type} et d'ID #${id} a été mis à jour à ${status}`, req)
    res.status(200).json({ data: post, message: 'Post status updated successfully' } as Return)
  }

  public updateCategories: RequestHandler<{ type: string, id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const type = String(req.params.type || 'page') as PostType

    const { ids } = req.body

    const post = await postService.updateCategories(id, ids)
    Log.info(`Les catégories du post de type ${type} et d'ID #${id} ont été mises à jour`, req)
    res.status(200).json({ data: post, message: 'Post categories updated successfully' } as Return)
  }

  public updateMedias: RequestHandler<{ type: string, id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const type = String(req.params.type || 'page') as PostType

    const { ids } = req.body

    const post = await postService.updateMedias(id, ids)
    Log.info(`Les médias du post de type ${type} et d'ID #${id} ont été mises à jour`, req)
    res.status(200).json({ data: post, message: 'Post medias updated successfully' } as Return)
  }

  public delete: RequestHandler<{ type: string, id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const type = String(req.params.type || 'page') as PostType

    await postService.delete(id)
    Log.info(`Le post de type ${type} et d'ID #${id} a été supprimée`, req)
    res.status(200).json({ message: 'Post deleted successfully' } as Return)
  }
}

export const postController = new PostController()
