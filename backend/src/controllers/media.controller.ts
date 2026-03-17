import { RequestHandler } from 'express'
import { mediaService } from '../services/media.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/request.utils'
import { paginate } from '../utils/pagination.utils'
import { MediaType } from '@brz/shared'
import 'multer' // augmente Express.Request avec .file et .files

export class MediaController {
  public getAll: RequestHandler = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const type = String(req.query.type || 'all') as MediaType | 'all'
    const order = parseOrder(req, [['created_at', 'DESC'], ['id', 'DESC']])

    const options = { search, type }

    const count = await mediaService.count(options)
    const pagination = paginate(page, limit, count, req?.user)
    const data = await mediaService.getAll(options, order, pagination)
    res.json({ pagination, data, message: 'Medias retrieved successfully' } as Return)
  }

  public getById: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)
    const type = String(req.query.type || 'all') as MediaType | 'all'

    const options = { type }

    const data = await mediaService.getById(id, options)
    res.json({ data, message: 'Media retrieved successfully' } as Return)
  }

  public upload: RequestHandler = async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: 'Aucun fichier fourni' } as Return)
      return
    }

    const data = await mediaService.createFromUpload(req.file, req.user?.id)
    res.status(201).json({ data, message: 'Media uploaded successfully' } as Return)
  }

  public uploadMultiple: RequestHandler = async (req, res) => {
    const files = req.files as Express.Multer.File[]
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'Aucun fichier fourni' } as Return)
      return
    }

    const data = await mediaService.createMultipleFromUpload(files, req.user?.id,)
    res.status(201).json({ data, message: 'Medias uploaded successfully' } as Return)
  }

  public update: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    const data = await mediaService.update(id, req.body)
    res.json({ data, message: 'Media updated successfully' } as Return)
  }

  public delete: RequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id)

    await mediaService.delete(id)
    res.json({ message: 'Media deleted successfully' } as Return)
  }

  public deleteMultiple: RequestHandler = async (req, res) => {
    const { ids } = req.body

    const count = await mediaService.deleteMultiple(ids)
    res.json({ data: { deleted: count }, message: 'Medias deleted successfully' } as Return)
  }
}

export const mediaController = new MediaController()