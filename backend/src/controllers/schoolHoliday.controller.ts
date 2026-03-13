import { RequestHandler } from 'express'
import { Return } from '../types/utils/api.types'
import { Order } from '@brz/shared'
import { SchoolYear } from '@brz/shared'
import { schoolHolidayService } from '../services/schoolHoliday.service'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'

export class SchoolHolidayController {
  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const year = String(req.query.year || 'all') as SchoolYear
    const order = parseOrder(req)

    const options = { search, year, }

    const count = await schoolHolidayService.count(options)
    const pagination = paginate(page, limit, count)
    const data = await schoolHolidayService.getAll(options, order, pagination)
    res.json({ pagination, data, message: 'School holidays retrieved successfully' } as Return)
  }

  public getFromYear: RequestHandler = async (req, res) => {
    const year = req.params.year as SchoolYear
    const options = { year }
    const order: Order[] = [['date_start', 'ASC']]

    const data = await schoolHolidayService.getAll(options, order)
    res.json({ data, message: 'School holidays retrieved successfully' } as Return)
  }

  public import: RequestHandler = async (req, res) => {
    const data = await schoolHolidayService.import()
    res.json({ data, message: 'School holidays imported successfully' } as Return)
  }
}

export const schoolHolidayController = new SchoolHolidayController()
