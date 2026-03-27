import { isQueryValid, Order } from '@brz/shared'
import { Pagination } from '@brz/shared'
import { POST_LINKS, POST_NAMES } from '../models/post.model'
import { postService } from '../services/post.service'
import { BadRequest } from '../exceptions/request.exception'
import { modelBuildLink } from '../utils/model.utils'

export class GlobalService {
  public async search(options?: { query?: string }): Promise<Record<string, unknown>[]> {
    const { query } = options || {}

    if (!isQueryValid(query)) throw new BadRequest('Missing parameter')

    const page = 1
    const limit = 2
    const order: Order[] = [['created_at', 'DESC']]
    const pagination: Pagination = { page, limit }

    const data = []

    // Posts
    const posts = await postService.getAll({ search: query }, order, pagination)
    const postsTransformed = posts.map(post => ({ title: post.title, slug: post.slug, _links: {}, _names: {} }))
    const elements = Array.isArray(postsTransformed) ? postsTransformed : [postsTransformed]
    for (const el of elements) {
      el._links = { self_front: modelBuildLink(POST_LINKS.self_front || null, el), self_api: modelBuildLink(POST_LINKS.self_api || null, el), list_front: modelBuildLink(POST_LINKS.list_front || null, el), list_api: modelBuildLink(POST_LINKS.list_api || null, el), }
      el._names = { nice: POST_NAMES.nice || null, name: POST_NAMES.name || null }
    }
    data.push(...elements)

    // TODO: Add search in more models ...

    return data
  }
}

export const globalService = new GlobalService()
