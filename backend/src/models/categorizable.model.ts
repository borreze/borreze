import { DataTypes, Model, Sequelize } from 'sequelize'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'
import { CATEGORIZABLE_TYPES_KEYS, CategorizableAttributes, CategorizableAttributesCreation, CategorizableType } from '@brz/shared'

export const CATEGORIZABLE_CONSTRAINTS = {
    category_id: {
        nicename: 'Catégorie',
        type: DataTypes.BIGINT,
        required: true
    },
    categorizable_id: {
        nicename: 'Entité catégorisable',
        type: DataTypes.BIGINT,
        required: true
    },
    type: {
        nicename: 'Type',
        type: DataTypes.ENUM(...CATEGORIZABLE_TYPES_KEYS),
        enum: CATEGORIZABLE_TYPES_KEYS,
        required: true
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
} as const satisfies ModelConstraints<CategorizableAttributes>

export class Categorizable extends Model<CategorizableAttributes, CategorizableAttributesCreation> implements CategorizableAttributes {
    public categorizable_id!: number
    public category_id!: number
    public type!: CategorizableType
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initCategorizableModel(sequelize: Sequelize) {
    Categorizable.init(modelBuild(CATEGORIZABLE_CONSTRAINTS), {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        tableName: 'categorizable',
        underscored: true,
        indexes: [
            { fields: ['type', 'categorizable_id'] },
            { fields: ['category_id'] }
        ]
    })
}