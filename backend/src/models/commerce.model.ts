import { DataTypes, Model, Sequelize } from 'sequelize'
import { CommerceAttributes, CommerceAttributesCreation } from '../types/models/commerce.types'
import { Category } from './category.model'
import { Media } from './media.model'
import { Schedule } from './schedule.model'
import { ModelConstraints } from '../types/utils/model.types'
import {  SearchResultLinks, SearchResultNames } from '../types/utils/search.types'
import { modelBuild } from '../utils/model.utils'

export const COMMERCE_CONSTRAINTS = {
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
    maxLength: 1000,
    required: false,
    searchable: true
  },
  cover_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  contact_name: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  contact_email: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  contact_phone: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  address: {
    type: DataTypes.STRING,
    maxLength: 500,
    required: false,
    searchable: true
  },
  website: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    required: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    required: false
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
  schedule_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  created_at: {
    type: DataTypes.DATE,
    required: true
  },
  updated_at: {
    type: DataTypes.DATE,
    required: true
  }
} as const satisfies ModelConstraints<CommerceAttributes>

export const COMMERCE_LINKS: SearchResultLinks = {
  'self_front': '/commerces/<slug>',
  'list_front': '/commerces',
  'self_api': '/commerces/<slug>',
  'list_api': '/commerces'
}

export const COMMERCE_NAMES: SearchResultNames = {
  nice: 'Commerces',
  name: 'commerce',
  type: 'model'
}

export const COMMERCE_INCLUDE_DEFAULTS = [
  { model: Media, as: 'cover' },
  { model: Schedule, as: 'schedule' },
  { model: Category, as: 'categories' }
]

export class Commerce extends Model<CommerceAttributes, CommerceAttributesCreation> implements CommerceAttributes {
  public id!: number
  public title!: string
  public description?: string | null
  public slug!: string
  public cover_id?: number
  public contact_name?: string
  public contact_email?: string
  public contact_phone?: string
  public address?: string
  public website?: string
  public latitude?: number
  public longitude?: number
  public schedule_id?: number
  public meta_title?: string | null
  public meta_description?: string | null
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initCommerceModel(sequelize: Sequelize) {
  Commerce.init(modelBuild(COMMERCE_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'commerce',
    underscored: true,
    indexes: [
      { fields: ['slug'] },
    ]
  })
}