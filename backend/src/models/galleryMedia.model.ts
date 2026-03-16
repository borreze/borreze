import { DataTypes, Model, Sequelize } from 'sequelize'
import { GalleryMediaAttributes, GalleryMediaAttributesCreation } from '../types/models/galleryMedia.types'
import { modelBuild } from '../utils/model.utils'
import { ModelConstraints } from '../types/utils/model.types'

export const GALLERY_MEDIA_CONSTRAINTS = {
    gallery_id: {
        type: DataTypes.BIGINT,
        required: true
    },
    media_id: {
        type: DataTypes.BIGINT,
        required: true
    },
    order: {
        type: DataTypes.INTEGER,
        required: false,
        defaultValue: 0,
        min: 0
    },
    created_at: {
        type: DataTypes.DATE,
        required: true,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        required: true,
        defaultValue: DataTypes.NOW
    }
} as const satisfies ModelConstraints<GalleryMediaAttributes>

export class GalleryMedia extends Model<GalleryMediaAttributes, GalleryMediaAttributesCreation> implements GalleryMediaAttributes {
    public gallery_id!: number
    public media_id!: number
    public order?: number | null
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initGalleryMediaModel(sequelize: Sequelize) {
    GalleryMedia.init(modelBuild(GALLERY_MEDIA_CONSTRAINTS), {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        tableName: 'gallery_media',
        underscored: true,
        indexes: [
            { fields: ['gallery_id', 'order'] }
        ]
    })
}