import { Gallery } from '../models'
import { Pagination } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { GalleryAttributes, GalleryAttributesCreation, GalleryAttributesUpdate } from '@brz/shared'
import { modelBuildWhere, searchWhere } from '../utils/model.utils'
import { GALLERY_CONSTRAINTS, GALLERY_INCLUDE_DEFAULTS } from '../models/gallery.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'
import { validateAll } from '../utils/validation.utils'

export class GalleryService {
  public async count(options?: { search?: string }): Promise<number> {
    const { search } = options || {}

    const where = modelBuildWhere([
      searchWhere(GALLERY_CONSTRAINTS, search),
    ])

    const result = await Gallery.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string }, order: Order[] = [], pagination?: Pagination | null): Promise<GalleryAttributes[]> {
    const { search } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    const where = modelBuildWhere([
      searchWhere(GALLERY_CONSTRAINTS, search),
    ])

    const galleries = await Gallery.findAll({ where, order, offset, limit, include: GALLERY_INCLUDE_DEFAULTS })
    return galleries
  }

  public async getById(id: number,): Promise<GalleryAttributes | null> {
    const where = modelBuildWhere([
      { id }
    ])

    const gallery = await Gallery.findOne({ where, include: GALLERY_INCLUDE_DEFAULTS })
    if (!gallery) throw new NotFound('Gallery not found')
    return gallery
  }

  public async create(data: GalleryAttributesCreation): Promise<GalleryAttributes | null> {
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, GALLERY_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return Gallery.create(data, { transaction, include: GALLERY_INCLUDE_DEFAULTS })
    })
  }

  public async update(id: number, data: GalleryAttributesUpdate): Promise<GalleryAttributes | null> {
    const { valid, errors } = validateAll(data, GALLERY_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const gallery = await Gallery.findByPk(id, { transaction, include: GALLERY_INCLUDE_DEFAULTS })
      if (!gallery) throw new NotFound('Gallery not found')

      await gallery.update(data, { transaction })
      return gallery
    }).then(async (gallery) => {
      if (!gallery) return null
      return gallery
    })
  }

  public async updatePhotos(id: number, ids: number[]): Promise<GalleryAttributes | null> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const gallery = await Gallery.findByPk(id, { transaction })
      if (!gallery) throw new NotFound('Gallery not found')

      await gallery.setPhotos(ids, { transaction })

      return gallery
    }).then(async (gallery) => {
      if (!gallery) return null
      return gallery
    })
  }

  public async delete(id: number): Promise<number> {
    const gallery = await Gallery.findByPk(id)
    if (!gallery) throw new NotFound('Gallery not found')

    const result = await Gallery.destroy({ where: { id } })
    if (!result) throw new NotFound('Gallery not found')
    return result
  }
}

export const galleryService = new GalleryService()
