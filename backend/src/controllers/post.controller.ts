import { RequestHandler } from 'express'
import { postService } from '../services/post.service'
import { Return } from '../types/utils/api.types'
import { parseArrayInteger, parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'
import { PostStatus } from '@brz/shared'
import { Order } from '@brz/shared'
import { Pagination } from '@brz/shared'
import { Log } from '../utils/log.utils'

export class PostController {
  public getRecents: RequestHandler = async (req, res) => {
    const page = 1
    const limit = 3
    const options = { status: 'published' as PostStatus }
    const order: Order[] = [['published_at', 'DESC'], ['created_at', 'DESC']]
    const pagination: Pagination = { page, limit, total: Infinity }

    const data = await postService.getAll(options, order, pagination, req?.user)
    res.status(200).json({ data, message: 'Posts retrieved successfully' } as Return)
  }

  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const status = String(req.query.status || 'published') as PostStatus | 'all'
    const order = parseOrder(req, [['created_at', 'DESC'], ['id', 'DESC']])
    const categories = parseArrayInteger(req.query.categories as Array<string>)

    const options = { search, status, categories }

    const count = await postService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await postService.getAll(options, order, pagination, req?.user)
    res.status(200).json({ pagination, data, message: 'Posts retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const status = String(req.query.status || 'published') as PostStatus | 'all'

    const options = { status }

    const post = await postService.getById(id, options)
    res.status(200).json({ data: post, message: 'Post retrieved successfully' } as Return)
  }

  public getBySlug: RequestHandler<{ slug: string }> = async (req, res) => {
    const slug = String(req.params.slug)

    const options = { status: 'published' as PostStatus }

    const post = await postService.getBySlug(slug, options)
    res.status(200).json({ data: post, message: 'Post retrieved successfully' } as Return)
  }

  public create: RequestHandler = async (req, res) => {
    const post = await postService.create(req.body)

    Log.info(`L'actualité d'ID #${post?.id} a été créée`, req)
    res.status(201).json({ data: post, message: 'Post created successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const post = await postService.update(id, req.body)
    Log.info(`L'actualité d'ID #${id} a été mise à jour`, req)
    res.status(200).json({ data: post, message: 'Post updated successfully' } as Return)
  }

  public updateStatus: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const { status } = req.body

    const post = await postService.updateStatus(id, status)
    Log.info(`Le statut de l'actualité d'ID #${id} a été mis à jour à ${status}`, req)
    res.status(200).json({ data: post, message: 'Post status updated successfully' } as Return)
  }
  
  public updateCategories: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const { ids } = req.body
    
    const post = await postService.updateCategories(id, ids)
    Log.info(`Les catégories de l'actualité d'ID #${id} ont été mises à jour`, req)
    res.status(200).json({ data: post, message: 'Post categories updated successfully' } as Return)
  }
  
  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    
    await postService.delete(id)
    Log.info(`L'actualité d'ID #${id} a été supprimée`, req)
    res.status(200).json({ message: 'Post deleted successfully' } as Return)
  }
}

export const postController = new PostController()
