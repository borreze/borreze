import { BelongsToManySetAssociationsMixin, DataTypes, Model, Sequelize } from 'sequelize'
import { POST_STATUSES_KEYS, PostAttributes, PostAttributesCreation, PostStatus } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { SearchResultLinks, SearchResultNames } from '@brz/shared'
import { modelBuild } from '../utils/model.utils'
import { Media } from './media.model'
import { Category } from './category.model'

export const POST_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cover_id: {
    nicename: 'Couverture',
    type: DataTypes.INTEGER,
    required: false
  },
  status: {
    nicename: 'Statut',
    type: DataTypes.ENUM(...POST_STATUSES_KEYS),
    enum: POST_STATUSES_KEYS,
    required: true,
    defaultValue: 'draft'
  },
  title: {
    nicename: 'Titre',
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  slug: {
    nicename: 'Slug',
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    unique: true,
    searchable: true
  },
  abstract: {
    nicename: 'Résumé',
    type: DataTypes.STRING,
    maxLength: 500,
    required: false,
    searchable: true
  },
  content: {
    nicename: 'Contenu',
    type: DataTypes.TEXT,
    required: false,
    searchable: true
  },
  meta_title: {
    nicename: 'Meta titre',
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  meta_description: {
    nicename: 'Meta description',
    type: DataTypes.STRING,
    maxLength: 500,
    required: false,
    searchable: true
  },
  published_at: {
    nicename: 'Date de publication',
    type: DataTypes.DATE,
    required: false
  },
  schedule_start: {
    nicename: 'Date de début de publication',
    type: DataTypes.DATE,
    required: false
  },
  schedule_end: {
    nicename: 'Date de fin de publication',
    type: DataTypes.DATE,
    required: false
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
} as const satisfies ModelConstraints<PostAttributes>

export const POST_LINKS: SearchResultLinks = {
  'self_front': '/actualites/<slug>',
  'list_front': '/actualites',
  'self_api': '/posts/<slug>',
  'list_api': '/posts'
}

export const POST_NAMES: SearchResultNames = {
  nice: 'Actualité',
  name: 'post',
  type: 'model'
}

export class Post extends Model<PostAttributes, PostAttributesCreation> implements PostAttributes {
  public id!: number
  public cover_id?: number
  public status!: PostStatus
  public title!: string
  public slug!: string
  public abstract?: string
  public content?: string
  public meta_title?: string
  public meta_description?: string
  public schedule_start?: Date
  public schedule_end?: Date
  public published_at?: Date
  public readonly created_at!: Date
  public readonly updated_at!: Date

  public categories?: Category[]
  public setCategories!: BelongsToManySetAssociationsMixin<Category, number>
}

export const POST_INCLUDE_DEFAULTS = [
  { model: Media, as: 'cover' },
  { model: Category, as: 'categories' },
]

export function initPostModel(sequelize: Sequelize) {
  Post.init(modelBuild(POST_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'post',
    underscored: true,
    indexes: [{ fields: ['slug'] }]
  })
}