import { Order } from '@brz/shared'
import { Pagination } from '@brz/shared'
import { modelAttach } from '../utils/model.utils'
import { POST_LINKS, POST_NAMES } from '../models/post.model'
import { postService } from '../services/post.service'
import { BadRequest } from '../exceptions/request.exception'

export class GlobalService {
  public async search(options?: { query?: string }): Promise<Record<string, unknown>[]> {
    let { query } = options || {}

    query = query?.trim() ?? ''
    if (!query || query.length <= 2) throw new BadRequest('Missing parameter')

    const page = 1
    const limit = 2
    const order: Order[] = [['created_at', 'DESC']]
    const pagination: Pagination = { page, limit }

    const data = []

    // Posts
    const posts = await postService.getAll({ search: query }, order, pagination)
    const postsTransformed = posts.map(post => ({ title: post.title, slug: post.slug }))
    modelAttach(postsTransformed, { links: POST_LINKS, names: POST_NAMES })
    data.push(...postsTransformed)

    // Events
    // ...

    // TODO: Add search in more models ...

    return data
  }
}

export const globalService = new GlobalService()
