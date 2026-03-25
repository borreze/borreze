import { Media } from '../models'
import { Op, WhereOptions } from 'sequelize'
import { Pagination, Order, MediaAttributes, MediaAttributesCreation, MediaAttributesUpdate, MediaType, resolveType, MEDIA_UPLOAD_DIR } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { searchWhere } from '../utils/model.utils'
import { MEDIA_CONSTRAINTS } from '../models/media.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'
import { validateAll } from '../utils/validation.utils'
import { mediaDeleteFile } from '../utils/media.utils'

export class MediaService {
  private filterType(type?: MediaType | 'all' | null): WhereOptions {
    if (!type || type === 'all') return {}
    return { type }
  }

  public async count(options?: { search?: string, type?: MediaType | 'all' | null }): Promise<number> {
    const { search, type } = options || {}

    const where: WhereOptions = {
      ...this.filterType(type),
      ...searchWhere(MEDIA_CONSTRAINTS, search)
    }

    const result = await Media.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string, type?: MediaType | 'all' | null }, order: Order[] = [], pagination?: Pagination | null): Promise<MediaAttributes[]> {
    const { search, type } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    const where: WhereOptions = {
      ...this.filterType(type),
      ...searchWhere(MEDIA_CONSTRAINTS, search)
    }

    const medias = await Media.findAll({ where, order, offset, limit })
    return medias
  }

  public async getById(id: number, options?: { type?: MediaType | 'all' | null }): Promise<MediaAttributes> {
    const { type } = options || {}

    const where: WhereOptions = {
      ...this.filterType(type),
      id
    }

    const media = await Media.findOne({ where })
    if (!media) throw new NotFound('Media not found')
    return media
  }

  public async createFromUpload(file: Express.Multer.File, uploadedBy?: number, transaction?: Transaction): Promise<MediaAttributes> {
    const data: MediaAttributesCreation = {
      title: file.originalname,
      file_name: file.filename,
      file_path: `/${MEDIA_UPLOAD_DIR}/${file.filename}`,
      type: resolveType(file.mimetype),
      mime_type: file.mimetype,
      size: file.size,
      uploaded_by: uploadedBy || null
    }

    const { valid, errors } = validateAll(data, MEDIA_CONSTRAINTS)
    if (!valid) throw new ValidationException('Champs invalides', errors)

    return Media.create(data, { transaction: transaction || undefined })
  }

  public async createMultipleFromUpload(files: Express.Multer.File[], uploadedBy?: number): Promise<MediaAttributes[]> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const medias: MediaAttributes[] = []
      for (const file of files) {
        const media = await this.createFromUpload(file, uploadedBy, transaction)
        medias.push(media)
      }
      return medias
    })
  }

  public async update(id: number, data: MediaAttributesUpdate): Promise<MediaAttributes | null> {
    const { valid, errors } = validateAll(data, MEDIA_CONSTRAINTS)
    if (!valid) throw new ValidationException('Erreur sur les champs', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      const media = await Media.findByPk(id, { transaction })
      if (!media) throw new NotFound('Media not found')

      await media.update(data, { transaction })
      return media
    }).then(async (media) => {
      if (!media) return null
      return media
    })
  }

  public async delete(id: number): Promise<number> {
    const media = await Media.findByPk(id)
    if (!media) throw new NotFound('Media not found')

    mediaDeleteFile(media.file_name)

    const result = await Media.destroy({ where: { id } })
    return result
  }

  public async deleteMultiple(ids: number[]): Promise<number> {
    const medias = await Media.findAll({ where: { id: { [Op.in]: ids } } })

    for (const media of medias) {
      mediaDeleteFile(media.file_name)
    }

    const result = await Media.destroy({ where: { id: { [Op.in]: ids } } })
    return result
  }


}

export const mediaService = new MediaService()