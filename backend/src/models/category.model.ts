import { Association, BelongsToManySetAssociationsMixin, DataTypes, Model, Sequelize } from 'sequelize'
import { CategoryAttributes, CategoryAttributesCreation } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'
import { Post } from './post.model'
import { Project } from './project.model'
import { Commerce } from './commerce.model'

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
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        required: true,
        defaultValue: DataTypes.NOW
    }
} as const satisfies ModelConstraints<CategoryAttributes>

export class Category extends Model<CategoryAttributes, CategoryAttributesCreation> implements CategoryAttributes {
    public id!: number
    public slug!: string
    public name!: string
    public readonly created_at!: Date
    public readonly updated_at!: Date

    public posts?: Post[]
    public setPosts!: BelongsToManySetAssociationsMixin<Post, number>
    public events?: Event[]
    public setEvents!: BelongsToManySetAssociationsMixin<Event, number>
    public projects?: Project[]
    public setProjects!: BelongsToManySetAssociationsMixin<Project, number>
    public commerces?: Commerce[]
    public setCommerces!: BelongsToManySetAssociationsMixin<Commerce, number>
    public associations?: Association[]
    public setAssociations!: BelongsToManySetAssociationsMixin<Association, number>
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