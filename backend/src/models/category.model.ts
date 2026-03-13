import { DataTypes, Model, Sequelize } from 'sequelize'
import { CategoryAttributes, CategoryAttributesCreation } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const CATEGORY_CONSTRAINTS = {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    slug: {
        type: DataTypes.STRING,
        maxLength: 255,
        required: true,
        unique: true,
        searchable: true
    },
    name: {
        type: DataTypes.STRING,
        maxLength: 255,
        required: true,
        searchable: true
    },
    created_at: {
        type: DataTypes.DATE,
        required: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        required: true,
    }
} as const satisfies ModelConstraints<CategoryAttributes>

export class Category extends Model<CategoryAttributes, CategoryAttributesCreation> implements CategoryAttributes {
    public id!: number
    public slug!: string
    public name!: string
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initCategoryModel(sequelize: Sequelize) {
    Category.init(modelBuild(CATEGORY_CONSTRAINTS), {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        tableName: 'category',
        underscored: true,
        indexes: [
            { fields: ['slug'] },
        ]
    })
}