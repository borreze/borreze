import type { CategoryAttributes } from "./category"

export const POST_STATUSES = ['draft', 'published', 'archived'] as const
export type PostStatus = typeof POST_STATUSES[number]

export const POST_STATUSES_WITH_LABELS: { value: PostStatus, label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
]

export interface PostAttributes {
    id: number
    slug: string
    cover_id?: number | null
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
    categories: CategoryAttributes[] // ! Frontend only
}