import { BelongsToManySetAssociationsMixin, DataTypes, Model, Sequelize } from 'sequelize'
import { EVENT_STATUSES_KEYS, EventAttributes, EventAttributesCreation, EventStatus } from '@brz/shared'
import { Category } from './category.model'
import { Gallery } from './gallery.model'
import { Media } from './media.model'
import { modelBuild } from '../utils/model.utils'
import { ModelConstraints } from '../types/utils/model.types'
import { SearchResultLinks, SearchResultNames } from '@brz/shared'

export const EVENT_CONSTRAINTS = {
    id: {
        nicename: 'ID',
        type: DataTypes.BIGINT,
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
    cover_id: {
        nicename: 'Couverture',
        type: DataTypes.BIGINT,
        required: false
    },
    status: {
        nicename: 'Statut',
        type: DataTypes.ENUM(...EVENT_STATUSES_KEYS),
        enum: EVENT_STATUSES_KEYS,
        defaultValue: 'draft'
    },
    date_time: {
        nicename: 'Date et heure',
        type: DataTypes.DATE,
        required: true
    },
    location: {
        nicename: 'Lieu',
        type: DataTypes.STRING,
        maxLength: 255,
        required: false,
        searchable: true
    },
    organizer_name: {
        nicename: 'Nom de l\'organisateur',
        type: DataTypes.STRING,
        maxLength: 255,
        required: false,
        searchable: true
    },
    organizer_email: {
        nicename: 'Email de l\'organisateur',
        type: DataTypes.STRING,
        maxLength: 255,
        required: false,
        searchable: true
    },
    organizer_phone: {
        nicename: 'Téléphone de l\'organisateur',
        type: DataTypes.STRING,
        maxLength: 11, // Format: +1234567890
        required: false,
        searchable: true,
        pattern: /^\+?\d{10,11}$/
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
} as const satisfies ModelConstraints<EventAttributes>

export const EVENT_LINKS: SearchResultLinks = {
    'self_front': '/evenements/<slug>',
    'list_front': '/evenements',
    'self_api': '/event/<slug>',
    'list_api': '/event'
}

export const EVENT_NAMES: SearchResultNames = {
    nice: 'Evénement',
    name: 'event',
    type: 'model'
}

export class Event extends Model<EventAttributes, EventAttributesCreation> implements EventAttributes {
    public id!: number
    public slug!: string
    public cover_id?: number
    public status!: EventStatus
    public title!: string
    public abstract?: string | null
    public content?: string | null
    public meta_title?: string | null
    public meta_description?: string | null
    public date_time!: Date
    public location?: string
    public organizer_name?: string
    public organizer_email?: string
    public organizer_phone?: string
    public schedule_start?: Date
    public schedule_end?: Date
    public published_at?: Date
    public readonly created_at!: Date
    public readonly updated_at!: Date

    public categories?: Category[]
    public setCategories!: BelongsToManySetAssociationsMixin<Category, number>
}

export const EVENT_INCLUDE_DEFAULTS = [
    { model: Media, as: 'cover' },
    { model: Gallery, as: 'gallery' },
    { model: Category, as: 'categories' }
]

export function initEventModel(sequelize: Sequelize) {
    Event.init(modelBuild(EVENT_CONSTRAINTS), {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        tableName: 'event',
        underscored: true,
        indexes: [
            { fields: ['slug'] },
            { fields: ['location'] },
        ]
    })
}