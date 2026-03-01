import { RequestHandler } from 'express'
import { Return } from '../types/utils/api.types'
import { globalService } from '../services/global.service'

export class GlobalController {
  public search: RequestHandler = async (req, res) => {
    const query = String(req.query.query || '')

    const data = await globalService.search({ query })

    res.json({ data, message: 'Results retrieved successfully' } as Return)
  }
}

export const globalController = new GlobalController()
