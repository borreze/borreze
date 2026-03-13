import { DataTypes, Model, Sequelize } from 'sequelize'
import { AssociationAttributes, AssociationAttributesCreation } from '@brz/shared'
import { Category } from './category.model'
import { Media } from './media.model'
import { ModelConstraints } from '../types/utils/model.types'
import {  SearchResultLinks, SearchResultNames } from '@brz/shared'
import { modelBuild } from '../utils/model.utils'

export const ASSOCIATION_CONSTRAINTS = {
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
    maxLength: 50,
    required: false,
    searchable: true
  },
  website: {
    type: DataTypes.STRING,
    maxLength: 255,
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
  created_at: {
    type: DataTypes.DATE,
    required: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    required: true,
  }
} as const satisfies ModelConstraints<AssociationAttributes>

export const PROJECT_LINKS: SearchResultLinks = {
  'self_front': '/associations/<slug>',
  'list_front': '/associations',
  'self_api': '/associations/<slug>',
  'list_api': '/associations'
}

export const PROJECT_NAMES: SearchResultNames = {
  nice: 'Associations',
  name: 'association',
  type: 'model'
}

export const ASSOCIATION_INCLUDE_DEFAULTS = [
  { model: Media, as: 'cover' },
  { model: Category, as: 'categories' }
]

export class Association extends Model<AssociationAttributes, AssociationAttributesCreation> implements AssociationAttributes {
  public id!: number
  public slug!: string
  public title!: string
  public description?: string | null
  public cover_id?: number
  public contact_name?: string
  public contact_email?: string
  public contact_phone?: string
  public website?: string
  public meta_title?: string
  public meta_description?: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initAssociationModel(sequelize: Sequelize) {
  Association.init(modelBuild(ASSOCIATION_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'association',
    underscored: true,
    indexes: [
      { fields: ['slug'] },
    ]
  })
}