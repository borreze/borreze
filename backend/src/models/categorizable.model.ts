import { DataTypes, Model, Sequelize } from 'sequelize'
import { CATEGORIZABLE_TYPES_KEYS, CategorizableAttributes, CategorizableAttributesCreation, CategorizableType } from '../../../shared/src/types/categorizable.types'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const CATEGORIZABLE_CONSTRAINTS = {
    category_id: {
        type: DataTypes.BIGINT,
        required: true
    },
    categorizable_id: {
        type: DataTypes.BIGINT,
        required: true
    },
    type: {
        type: DataTypes.ENUM(...CATEGORIZABLE_TYPES_KEYS),
        enum: CATEGORIZABLE_TYPES_KEYS,
        required: true
    },
    created_at: {
        type: DataTypes.DATE,
        required: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        required: true,
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