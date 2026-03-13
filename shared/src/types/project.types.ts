import { Optional } from 'sequelize'

export const PROJECT_STATUSES_KEYS = ['planned', 'ongoing', 'completed'] as const
export type ProjectStatus = typeof PROJECT_STATUSES_KEYS[number]
export const PROJECT_STATUSES_OBJECTS: { value: ProjectStatus, label: string }[] = [
    { value: 'planned', label: 'Planifié' },
    { value: 'ongoing', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
]

export interface ProjectAttributes {
    id: number
    slug: string
    title: string
    description?: string | null
    cover_id?: number | null
    gallery_id?: number | null
    status: ProjectStatus
    meta_title?: string | null
    meta_description?: string | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type ProjectAttributesCreation = Optional<ProjectAttributes, 'id' | 'description' | 'meta_title' | 'meta_description' | 'cover_id' | 'gallery_id' | 'created_at' | 'updated_at'>
export type ProjectAttributesUpdate = Optional<ProjectAttributes, 'id' | 'slug' | 'title' | 'description' | 'meta_title' | 'meta_description' | 'status' | 'cover_id' | 'gallery_id' | 'created_at' | 'updated_at'>