import { Optional } from 'sequelize'

export const PAGE_STATUSES = ['draft', 'published', 'archived'] as const
export type PageStatus = typeof PAGE_STATUSES[number]

export interface PageAttributes {
    id: number
    cover_id?: number | null
    gallery_id?: number | null
    status: PageStatus
    title: string
    slug: string
    abstract?: string | null
    content?: string | null
    meta_title?: string | null
    meta_description?: string | null
    deletable: boolean
    published_at?: Date | null
    schedule_start?: Date | null
    schedule_end?: Date | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type PageAttributesCreation = Optional<PageAttributes, 'id' | 'cover_id' | 'gallery_id' | 'abstract' | 'content' | 'meta_title' | 'meta_description' | 'published_at' | 'schedule_start' | 'schedule_end' | 'deletable' | 'created_at' | 'updated_at'>
export type PageAttributesUpdate = Optional<PageAttributes, 'id' | 'cover_id' | 'gallery_id' | 'status' | 'title' | 'slug' | 'abstract' | 'content' | 'meta_title' | 'meta_description' | 'published_at' | 'schedule_start' | 'schedule_end' | 'deletable' | 'created_at' | 'updated_at'>