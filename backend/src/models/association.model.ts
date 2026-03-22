import { BelongsToManySetAssociationsMixin, DataTypes, Model, Sequelize } from 'sequelize'
import { AssociationAttributes, AssociationAttributesCreation } from '@brz/shared'
import { Category } from './category.model'
import { Media } from './media.model'
import { ModelConstraints } from '../types/utils/model.types'
import { SearchResultLinks, SearchResultNames } from '@brz/shared'
import { modelBuild } from '../utils/model.utils'

export const ASSOCIATION_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  slug: {
    nicename: 'Slug',
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    unique: true,
    searchable: true
  },
  title: {
    nicename: 'Titre',
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  description: {
    nicename: 'Description',
    type: DataTypes.STRING,
    maxLength: 1000,
    required: false,
    searchable: true
  },
  cover_id: {
    nicename: 'Couverture',
    type: DataTypes.INTEGER,
    required: false
  },
  contact_name: {
    nicename: 'Nom du contact',
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  contact_email: {
    nicename: 'Email du contact',
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  contact_phone: {
    nicename: 'Téléphone du contact',
    type: DataTypes.STRING,
    maxLength: 50,
    required: false,
    searchable: true
  },
  website: {
    nicename: 'Site web',
    type: DataTypes.STRING,
    maxLength: 255,
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

  public categories?: Category[]
  public setCategories!: BelongsToManySetAssociationsMixin<Category, number>
}

export const ASSOCIATION_INCLUDE_DEFAULTS = [
  { model: Media, as: 'cover' },
  { model: Category, as: 'categories' }
]

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