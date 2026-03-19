import { BelongsToManySetAssociationsMixin, DataTypes, Model, Sequelize } from 'sequelize'
import { GalleryAttributes, GalleryAttributesCreation } from '@brz/shared'
import { Media } from './media.model'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const GALLERY_CONSTRAINTS = {
    id: {
        nicename: 'ID',
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        nicename: 'Nom',
        type: DataTypes.STRING,
        maxLength: 255,
        required: true,
        searchable: true
    },
    created_at: {
        nicename: 'Date de création',
        type: DataTypes.DATE,
        required: true,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        nicename: 'Date de mise à jour',
        type: DataTypes.DATE,
        required: true,
        defaultValue: DataTypes.NOW
    }
} as const satisfies ModelConstraints<GalleryAttributes>

export const GALLERY_INCLUDE_DEFAULTS = [
    { model: Media, as: 'photos' }
]

export class Gallery extends Model<GalleryAttributes, GalleryAttributesCreation> implements GalleryAttributes {
    public id!: number
    public name!: string
    public readonly created_at!: Date
    public readonly updated_at!: Date

    public photos?: Media[]
    public setPhotos!: BelongsToManySetAssociationsMixin<Media, number>
}

export function initGalleryModel(sequelize: Sequelize) {
    Gallery.init(modelBuild(GALLERY_CONSTRAINTS), {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        tableName: 'gallery',
        underscored: true
    })
}