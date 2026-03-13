import { DataTypes, Model, Sequelize } from 'sequelize'
import { POST_STATUSES, PostAttributes, PostAttributesCreation, PostStatus } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import {  SearchResultLinks, SearchResultNames } from '../types/utils/search.types'
import { modelBuild } from '../utils/model.utils'
import { Media } from './media.model'
import { Category } from './category.model'

export const POST_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  cover_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  status: {
    type: DataTypes.ENUM(...POST_STATUSES),
    enum: POST_STATUSES,
    required: true,
    default: 'draft'
  },
  title: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  slug: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    unique: true,
    searchable: true
  },
  abstract: {
    type: DataTypes.STRING,
    maxLength: 500,
    required: false,
    searchable: true
  },
  content: {
    type: DataTypes.TEXT,
    required: false,
    searchable: true
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
  published_at: {
    type: DataTypes.DATE,
    required: false
  },
  schedule_start: {
    type: DataTypes.DATE,
    required: false
  },
  schedule_end: {
    type: DataTypes.DATE,
    required: false
  },
  created_at: {
    type: DataTypes.DATE,
    required: false
  },
  updated_at: {
    type: DataTypes.DATE,
    required: false
  },
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

export const POST_INCLUDE_DEFAULTS = [
  { model: Media, as: 'cover' },
  { model: Category, as: 'categories' },
]

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
}

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