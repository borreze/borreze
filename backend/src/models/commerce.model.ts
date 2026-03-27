import { BelongsToManySetAssociationsMixin, DataTypes, Model, Sequelize } from 'sequelize'
import { CommerceAttributes, CommerceAttributesCreation } from '@brz/shared'
import { Category } from './category.model'
import { Media } from './media.model'
import { Schedule } from './schedule.model'
import { ModelConstraints } from '../types/utils/model.types'
import { SearchResultLinks, SearchResultNames } from '@brz/shared'
import { modelBuild } from '../utils/model.utils'

export const COMMERCE_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    nicename: 'Nom',
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  contact_email: {
    nicename: 'Email de contact',
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  contact_phone: {
    nicename: 'Téléphone de contact',
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  address: {
    nicename: 'Adresse',
    type: DataTypes.STRING,
    maxLength: 500,
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
  latitude: {
    nicename: 'Latitude',
    type: DataTypes.DECIMAL(10, 8),
    required: false
  },
  longitude: {
    nicename: 'Longitude',
    type: DataTypes.DECIMAL(11, 8),
    required: false
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
}

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

  public categories?: Category[]
  public setCategories!: BelongsToManySetAssociationsMixin<Category, number>
}

export const COMMERCE_INCLUDE_DEFAULTS = [
  { model: Media, as: 'cover' },
  { model: Schedule, as: 'schedule' },
  { model: Category, as: 'categories' }
]

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