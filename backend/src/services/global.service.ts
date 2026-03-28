import { isQueryValid, Order, PostType } from '@brz/shared'
import { Pagination } from '@brz/shared'
import { POST_LINKS_BY_TYPE, POST_NAMES_BY_TYPE } from '../models/post.model'
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
    const postsTransformed = posts.map(post => ({ title: post.title, slug: post.slug, type: post.type, _links: {}, _names: {} }))
    const elements = Array.isArray(postsTransformed) ? postsTransformed : [postsTransformed]
    for (const el of elements) {
      const links = POST_LINKS_BY_TYPE[(el.type as PostType)]
      const names = POST_NAMES_BY_TYPE[(el.type as PostType)]
      el._links = { self_front: modelBuildLink(links.self_front || null, el), self_api: modelBuildLink(links.self_api || null, el), list_front: modelBuildLink(links.list_front || null, el), list_api: modelBuildLink(links.list_api || null, el), }
      el._names = { nice: names.nice || null, name: names.name || null }
    }
    data.push(...elements)

    // TODO: Add search in more models ...

    return data
  }
}

export const globalService = new GlobalService()
