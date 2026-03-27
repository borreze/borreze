import { DataTypes, Model, Sequelize } from 'sequelize'
import { PAGE_STATUSES_KEYS, PageAttributes, PageAttributesCreation, PageStatus } from '@brz/shared'
import { Media } from './media.model'
import { Gallery } from './gallery.model'
import { PageAttribute } from './pageAttribute.model'
import { ModelConstraints } from '../types/utils/model.types'
import { SearchResultLinks, SearchResultNames } from '@brz/shared'
import { modelBuild } from '../utils/model.utils'

export const PAGE_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cover_id: {
    nicename: 'Couverture',
    type: DataTypes.INTEGER,
    required: false
  },
  gallery_id: {
    nicename: 'Galerie',
    type: DataTypes.INTEGER,
    required: false
  },
  status: {
    nicename: 'Statut',
    type: DataTypes.ENUM(...PAGE_STATUSES_KEYS),
    enum: PAGE_STATUSES_KEYS,
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
  deletable: { // Useful for preventing deletion of pages that are essential for the site (e.g., homepage, legal notice, etc.)
    nicename: 'Supprimable',
    type: DataTypes.BOOLEAN,
    required: true,
    defaultValue: true
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
}

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

export const PAGE_INCLUDE_DEFAULTS = [
  { model: Media, as: 'cover' },
  { model: Gallery, as: 'gallery' },
  { model: PageAttribute, as: 'attributes' }
]

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