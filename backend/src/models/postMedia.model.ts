import { DataTypes, Model, Sequelize } from 'sequelize'
import { PostMediaAttributes, PostMediaAttributesCreation } from '../types/models/postMedia.types'
import { modelBuild } from '../utils/model.utils'
import { ModelConstraints } from '../types/utils/model.types'

export const POST_MEDIA_CONSTRAINTS = {
    post_id: {
        nicename: 'Post',
        type: DataTypes.INTEGER,
        required: true
    },
    media_id: {
        nicename: 'Média',
        type: DataTypes.INTEGER,
        required: true
    },
    order: {
        nicename: 'Ordre',
        type: DataTypes.INTEGER,
        required: false,
        defaultValue: 0,
        min: 0
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
} as const satisfies ModelConstraints<PostMediaAttributes>

export class PostMedia extends Model<PostMediaAttributes, PostMediaAttributesCreation> implements PostMediaAttributes {
    public post_id!: number
    public media_id!: number
    public order?: number | null
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initPostMediaModel(sequelize: Sequelize) {
    PostMedia.init(modelBuild(POST_MEDIA_CONSTRAINTS), {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        tableName: 'post_media',
        underscored: true,
        indexes: [
            { fields: ['post_id', 'order'] }
        ]
    })
}