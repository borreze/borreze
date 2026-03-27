import { Optional } from 'sequelize'
import { CategoryAttributes } from './category.types'
import { MediaAttributes } from './media.types'

export const POST_STATUSES_KEYS = ['draft', 'published', 'archived'] as const
export type PostStatus = typeof POST_STATUSES_KEYS[number]
export const POST_STATUSES_OBJECTS: { value: PostStatus, label: string, color?: string }[] = [
    { value: 'published', label: 'Publié', color: '#349c17' },
    { value: 'archived', label: 'Archivé', color: '#c146e0' },
    { value: 'draft', label: 'Brouillon', color: '#5dd7d9' },
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
    id: number
    slug: string
    cover_id?: number | null
    status: PostStatus
    type: PostType
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
}

export interface PostAttributesFrontend extends PostAttributes { categories?: CategoryAttributes[], cover?: MediaAttributes }

export type PostAttributesCreation = Optional<PostAttributes,
    'id' | 'cover_id' | 'abstract' | 'content' | 'meta_title' | 'meta_description' |
    'published_at' | 'schedule_start' | 'schedule_end' | 'created_at' | 'updated_at'
>

export type PostAttributesUpdate = Optional<PostAttributes,
    'id' | 'cover_id' | 'status' | 'type' | 'title' | 'slug' | 'abstract' | 'content' | 'meta_title' |
    'meta_description' | 'published_at' | 'schedule_start' | 'schedule_end' | 'created_at' | 'updated_at'
>