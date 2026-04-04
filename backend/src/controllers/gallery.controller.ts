import { RequestHandler } from 'express'
import { galleryService } from '../services/gallery.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'
import { Log } from '../utils/log.utils'

export class GalleryController {
  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req, [['created_at', 'DESC'], ['id', 'DESC']])

    const options = { search }

    const count = await galleryService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await galleryService.getAll(options, order, pagination)
    res.status(200).json({ pagination, data, message: 'Galleries retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const gallery = await galleryService.getById(id)
    res.status(200).json({ data: gallery, message: 'Gallery retrieved successfully' } as Return)
  }

  public create: RequestHandler = async (req, res) => {
    const gallery = await galleryService.create(req.body)

    Log.info(`La galerie d'ID #${gallery?.id} a été créée`, req)
    res.status(201).json({ data: gallery, message: 'Gallery created successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const gallery = await galleryService.update(id, req.body)
    Log.info(`Le gallery d'ID #${id} a été mise à jour`, req)
    res.status(200).json({ data: gallery, message: 'Gallery updated successfully' } as Return)
  }

  public updatePhotos: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const { ids } = req.body

    const gallery = await galleryService.updatePhotos(id, ids)
    Log.info(`Les photos de la galerie d'ID #${id} ont été mises à jour`, req)
    res.status(200).json({ data: gallery, message: 'Gallery photos updated successfully' } as Return)
  }

  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    await galleryService.delete(id)
    Log.info(`Le gallery d'ID #${id} a été supprimée`, req)
    res.status(200).json({ message: 'Gallery deleted successfully' } as Return)
  }
}

export const galleryController = new GalleryController()
