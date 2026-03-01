import { RequestHandler } from 'express'
import { categoryService } from '../services/category.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'

export class CategoryController {
  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const type = String(req.query.type || 'all')
    const order = parseOrder(req)

    const options = { search, type }

    const count = await categoryService.count(options)
    const pagination = paginate(page, limit, count)
    const data = await categoryService.getAll(options, order, pagination)
    res.json({ pagination, data, message: 'Categories retrieved successfully' } as Return)
  }

  public getAllByType: RequestHandler<{ type: string }> = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req)
    const type = String(req.params.type)

    const options = { search, type }

    const count = await categoryService.count(options)
    const pagination = paginate(page, limit, count)
    const data = await categoryService.getAll(options, order, pagination)
    res.json({ pagination, data, message: 'Categories retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const type = String(req.query.type || 'all')

    const options = { type }

    const category = await categoryService.getById(id, options)
    res.json({ data: category, message: 'Category retrieved successfully' } as Return)
  }

  public create: RequestHandler = async (req, res) => {
    const category = await categoryService.create(req.body)

    res.status(201).json({ data: category, message: 'Category created successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const category = await categoryService.update(id, req.body)
    res.status(200).json({ data: category, message: 'Category updated successfully' } as Return)
  }

  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    await categoryService.delete(id)
    res.status(200).json({ message: 'Category deleted successfully' } as Return)
  }
}

export const categoryController = new CategoryController()
