import { BelongsToManySetAssociationsMixin, DataTypes, Model, Sequelize } from 'sequelize'
import { PROJECT_STATUSES_KEYS, ProjectAttributes, ProjectAttributesCreation, ProjectStatus } from '@brz/shared'
import { Media } from './media.model'
import { Gallery } from './gallery.model'
import { Category } from './category.model'
import { ModelConstraints } from '../types/utils/model.types'
import { SearchResultLinks, SearchResultNames } from '@brz/shared'
import { modelBuild } from '../utils/model.utils'


export const PROJECT_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  slug: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    unique: true,
    searchable: true
  },
  title: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  description: {
    type: DataTypes.STRING,
    maxLength: 500,
    required: false,
    searchable: true
  },
  cover_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  gallery_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  status: {
    type: DataTypes.ENUM(...PROJECT_STATUSES_KEYS),
    enum: PROJECT_STATUSES_KEYS,
    defaultValue: 'planned',
    required: true
  },
  meta_title: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  meta_description: {
    type: DataTypes.STRING,
    maxLength: 500,
    required: false,
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
} as const satisfies ModelConstraints<ProjectAttributes>

export const PROJECT_LINKS: SearchResultLinks = {
  'self_front': '/projets/<slug>',
  'list_front': '/projets',
  'self_api': '/projects/<slug>',
  'list_api': '/projects'
}

export const PROJECT_NAMES: SearchResultNames = {
  nice: 'Projet',
  name: 'project',
  type: 'model'
}

export const PROJECT_INCLUDE_DEFAULTS = [
  { model: Media, as: 'cover' },
  { model: Gallery, as: 'gallery' },
  { model: Category, as: 'categories' }
]

export class Project extends Model<ProjectAttributes, ProjectAttributesCreation> implements ProjectAttributes {
  public id!: number
  public slug!: string
  public title!: string
  public description?: string | null
  public gallery_id?: number | null
  public cover_id?: number
  public status!: ProjectStatus
  public meta_title?: string | null
  public meta_description?: string | null
  public readonly created_at!: Date
  public readonly updated_at!: Date

  public categories?: Category[]
  public setCategories!: BelongsToManySetAssociationsMixin<Category, number>
}

export function initProjectModel(sequelize: Sequelize) {
  Project.init(modelBuild(PROJECT_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'project',
    underscored: true,
    indexes: [
      { fields: ['slug'] },
    ]
  })
}