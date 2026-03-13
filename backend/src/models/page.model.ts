import { DataTypes, Model, Sequelize } from 'sequelize'
import { PAGE_STATUSES, PageAttributes, PageAttributesCreation, PageStatus } from '@brz/shared'
import { Media } from './media.model'
import { Gallery } from './gallery.model'
import { PageAttribute } from './pageAttribute.model'
import { ModelConstraints } from '../types/utils/model.types'
import {  SearchResultLinks, SearchResultNames } from '../types/utils/search.types'
import { modelBuild } from '../utils/model.utils'

export const PAGE_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
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
    type: DataTypes.ENUM(...PAGE_STATUSES),
    enum: PAGE_STATUSES,
    required: true,
    defaultValue: 'draft'
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
  deletable: {
    type: DataTypes.BOOLEAN,
    required: true,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    required: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    required: true,
  }
} as const satisfies ModelConstraints<PageAttributes>

export const PAGE_LINKS: SearchResultLinks = {
  'self_front': '/pages/<slug>',
  'list_front': '/pages',
  'self_api': '/pages/<slug>',
  'list_api': '/pages'
}

export const PAGE_NAMES: SearchResultNames = {
  nice: 'Page',
  name: 'page',
  type: 'model'
}

export const PAGE_INCLUDE_DEFAULTS = [
  { model: Media, as: 'cover' },
  { model: Gallery, as: 'gallery' },
  { model: PageAttribute, as: 'attributes' }
]

export class Page extends Model<PageAttributes, PageAttributesCreation> implements PageAttributes {
  public id!: number
  public cover_id?: number | null
  public gallery_id?: number | null
  public status!: PageStatus
  public title!: string
  public slug!: string
  public abstract?: string | null
  public content?: string | null
  public meta_title?: string | null
  public meta_description?: string | null
  public deletable!: boolean
  public schedule_start?: Date
  public schedule_end?: Date
  public published_at?: Date
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initPageModel(sequelize: Sequelize) {
  Page.init(modelBuild(PAGE_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'page',
    underscored: true,
    indexes: [
      { fields: ['slug'] },
    ]
  })
}