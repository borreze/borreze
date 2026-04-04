import { Optional } from 'sequelize'
import { CategoryAttributes } from './category.types'
import { MediaAttributes } from './media.types'
import { PostAttributeAttributes } from './postAttribute.types'
import { ScheduleAttributes } from './schedule.types'
import { GalleryAttributes } from './gallery.types'

export const POST_STATUSES_KEYS = ['draft', 'published', 'archived'] as const
export type PostStatus = typeof POST_STATUSES_KEYS[number]
export const POST_STATUSES_OBJECTS: { value: PostStatus, label: string, color?: string }[] = [
    { value: 'published', label: 'Publié', color: '#349c17' },
    { value: 'archived', label: 'Archivé', color: '#c146e0' },
    { value: 'draft', label: 'Brouillon', color: '#5dd7d9' },
]

export const POST_PROGESSIONS_KEYS = ['planned', 'ongoing', 'completed'] as const
export type PostProgression = typeof POST_PROGESSIONS_KEYS[number]
export const POST_PROGESSIONS_OBJECTS: { value: PostProgression, label: string, color?: string, percent?: number }[] = [
    { value: 'planned', label: 'Planifié', color: '#6366f1', percent: 15 },
    { value: 'ongoing', label: 'En cours', color: '#f59e0b', percent: 55 },
    { value: 'completed', label: 'Terminé', color: '#10b981', percent: 100 },
]

export const POST_TYPES_KEYS = ['association', 'commerce', 'event', 'page', 'new', 'project'] as const
export type PostType = typeof POST_TYPES_KEYS[number]
export const POST_TYPES_OBJECTS: { value: PostType, label: string, }[] = [
    { value: 'association', label: 'Association' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'event', label: 'Événement' },
    { value: 'page', label: 'Page' },
    { value: 'new', label: 'Actualité' },
    { value: 'project', label: 'Projet' },
]

export interface PostAttributes {
    // Common
    id: number
    slug: string
    cover_id?: number | null
    type: PostType
    status: PostStatus
    title: string
    abstract?: string | null
    content?: string | null
    meta_title?: string | null
    meta_description?: string | null
    published_at?: Date | null
    schedule_start?: Date | null
    schedule_end?: Date | null
    created_at?: Date | null
    updated_at?: Date | null
    // Event
    date_time?: Date | null
    // Commerce & event
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    // Commerce
    website?: string | null
    // Page 
    deletable?: boolean | null // Useful for preventing deletion of pages that are essential for the site (e.g., homepage, legal notice, etc.)
    // Page & project
    gallery_id?: number | null
    // Project
    progression?: PostProgression | null
}

export interface PostAttributesFrontend extends PostAttributes { categories?: CategoryAttributes[], cover?: MediaAttributes, attributes?: PostAttributeAttributes[], schedules?: ScheduleAttributes[], gallery?: GalleryAttributes }

export type PostAttributesCreation = Optional<PostAttributes,
    'id' | 'cover_id' | 'gallery_id' | 'date_time' | 'contact_name' | 'contact_email' | 'contact_phone' | 'address' | 'website' | 'latitude' | 'longitude' | 'abstract' | 'deletable' | 'progression' | 'content' | 'meta_title' | 'meta_description' |
    'published_at' | 'schedule_start' | 'schedule_end' | 'created_at' | 'updated_at'
>

export type PostAttributesUpdate = Optional<PostAttributes,
    'id' | 'cover_id' | 'gallery_id' | 'date_time' | 'contact_name' | 'contact_email' | 'contact_phone' | 'address' | 'website' | 'latitude' | 'longitude' | 'status' | 'type' | 'title' | 'slug' | 'abstract' | 'deletable' | 'progression' | 'content' | 'meta_title' |
    'meta_description' | 'published_at' | 'schedule_start' | 'schedule_end' | 'created_at' | 'updated_at'
>