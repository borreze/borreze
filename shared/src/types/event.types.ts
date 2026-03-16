import { Optional } from 'sequelize'

export const EVENT_STATUSES_KEYS = ['draft', 'published', 'archived'] as const
export type EventStatus = typeof EVENT_STATUSES_KEYS[number]
export const EVENT_STATUSES_OBJECTS: { value: EventStatus, label: string, color?: string }[] = [
    { value: 'published', label: 'Publié', color: '#349c17' },
    { value: 'archived', label: 'Archivé', color: '#c146e0' },
    { value: 'draft', label: 'Brouillon', color: '#5dd7d9' },
]

export interface EventAttributes {
    id: number
    slug: string
    cover_id?: number | null
    status: EventStatus
    title: string
    abstract?: string | null
    content?: string | null
    meta_title?: string | null
    meta_description?: string | null
    date_time: Date
    location?: string | null
    organizer_name?: string | null
    organizer_email?: string | null
    organizer_phone?: string | null
    published_at?: Date | null
    schedule_start?: Date | null
    schedule_end?: Date | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type EventAttributesCreation = Optional<EventAttributes, 'id' | 'cover_id' | 'location' | 'abstract' | 'content' | 'meta_title' | 'meta_description' | 'organizer_name' | 'organizer_email' | 'organizer_phone' | 'published_at' | 'schedule_start' | 'schedule_end' | 'created_at' | 'updated_at'>
export type EventAttributesUpdate = Optional<EventAttributes, 'id' | 'slug' | 'cover_id' | 'status' | 'abstract' | 'title' | 'content' | 'meta_title' | 'meta_description' | 'date_time' | 'location' | 'organizer_name' | 'organizer_email' | 'organizer_phone' | 'published_at' | 'schedule_start' | 'schedule_end' | 'created_at' | 'updated_at'>