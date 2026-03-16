import { Optional } from 'sequelize'

export const MEDIA_TYPES_KEYS = ['image', 'document'] as const
export type MediaType = typeof MEDIA_TYPES_KEYS[number]
export const MEDIA_TYPES_OBJECTS: { value: MediaType, label: string, icon?: string }[] = [
    { value: 'image', label: 'Image', icon: 'ic:round-image' },
    { value: 'document', label: 'Document', icon: 'ic:baseline-description' },
]

export interface MediaAttributes {
    id: number
    file_name: string
    file_path: string
    type: MediaType
    mime_type: string
    size: number
    folder?: string | null
    uploaded_by?: number | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type MediaAttributesCreation = Optional<MediaAttributes, 'id' | 'folder' | 'uploaded_by' | 'created_at' | 'updated_at'>
export type MediaAttributesUpdate = Optional<MediaAttributes, 'id' | 'file_name' | 'file_path' | 'type' | 'mime_type' | 'size' | 'folder' | 'uploaded_by' | 'created_at' | 'updated_at'>