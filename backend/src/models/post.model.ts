import { BelongsToManySetAssociationsMixin, DataTypes, Model, Sequelize } from 'sequelize'
import { POST_PROGESSIONS_KEYS, POST_STATUSES_KEYS, PostAttributes, PostAttributesCreation, PostProgression, PostStatus } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { SearchResultLinks, SearchResultNames } from '@brz/shared'
import { modelBuild } from '../utils/model.utils'
import { Media } from './media.model'
import { Category } from './category.model'
import { POST_TYPES_KEYS, PostType } from '@brz/shared'
import { PostAttribute } from './postAttribute.model'
import { Gallery } from './gallery.model'
import { Schedule } from './schedule.model'

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
  gallery_id: {
    nicename: 'Galerie',
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
  progression: {
    nicename: 'Avancement',
    type: DataTypes.ENUM(...POST_PROGESSIONS_KEYS),
    enum: POST_PROGESSIONS_KEYS,
    defaultValue: 'planned',
    required: false
  },
  type: {
    nicename: 'Type',
    type: DataTypes.ENUM(...POST_TYPES_KEYS),
    enum: POST_TYPES_KEYS,
    required: true,
    defaultValue: 'new'
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
  date_time: {
    nicename: 'Date et heure',
    type: DataTypes.DATE,
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
  deletable: {
    nicename: 'Supprimable',
    type: DataTypes.BOOLEAN,
    required: false,
    defaultValue: true
  },
  unpublishable: {
    nicename: 'Dépubliable',
    type: DataTypes.BOOLEAN,
    required: false,
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
} as const satisfies ModelConstraints<PostAttributes>

export const POST_LINKS_BY_TYPE: Record<PostType, SearchResultLinks> = {
  association: {
    'self_front': '/associations/<slug>',
    'list_front': '/associations',
    'self_api': '/posts/association/<slug>',
    'list_api': '/posts/association'
  },
  commerce: {
    'self_front': '/commerces/<slug>',
    'list_front': '/commerces',
    'self_api': '/posts/commerce/<slug>',
    'list_api': '/posts/commerce'
  },
  event: {
    'self_front': '/evenements/<slug>',
    'list_front': '/evenements',
    'self_api': '/posts/event/<slug>',
    'list_api': '/posts/event'
  },
  page: {
    'self_front': '/pages/<slug>',
    'list_front': '/pages',
    'self_api': '/posts/page/<slug>',
    'list_api': '/posts/page'
  },
  new: {
    'self_front': '/actualites/<slug>',
    'list_front': '/actualites',
    'self_api': '/posts/new/<slug>',
    'list_api': '/posts/new'
  },
  project: {
    'self_front': '/projets/<slug>',
    'list_front': '/projets',
    'self_api': '/posts/project/<slug>',
    'list_api': '/posts/project'
  }
}

export const POST_NAMES_BY_TYPE: Record<PostType, SearchResultNames> = {
  association: {
    nice: 'Association',
    name: 'association'
  },
  commerce: {
    nice: 'Commerce',
    name: 'commerce'
  },
  event: {
    nice: 'Événement',
    name: 'event'
  },
  page: {
    nice: 'Page',
    name: 'page'
  },
  new: {
    nice: 'Actualité',
    name: 'new'
  },
  project: {
    nice: 'Projet',
    name: 'project'
  }
}

export class Post extends Model<PostAttributes, PostAttributesCreation> implements PostAttributes {
  public id!: number
  public slug!: string
  public cover_id?: number
  public type!: PostType
  public status!: PostStatus
  public title!: string
  public abstract?: string
  public content?: string
  public meta_title?: string
  public meta_description?: string
  public published_at?: Date
  public schedule_start?: Date
  public schedule_end?: Date
  public date_time?: Date
  public contact_name?: string
  public contact_email?: string
  public contact_phone?: string
  public address?: string
  public latitude?: number
  public longitude?: number
  public website?: string
  public deletable?: boolean
  public unpublishable?: boolean
  public gallery_id?: number
  public progression?: PostProgression
  public readonly created_at!: Date
  public readonly updated_at!: Date

  public categories?: Category[]
  public setCategories!: BelongsToManySetAssociationsMixin<Category, number>
}

export const POST_INCLUDE_DEFAULTS = [
  { model: Media, as: 'cover' },
  { model: Category, as: 'categories' },
  { model: Gallery, as: 'gallery' },
  { model: PostAttribute, as: 'attributes' },
  { model: Schedule, as: 'schedules' },
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