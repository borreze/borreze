import { Optional } from 'sequelize'

export const MEDIA_UPLOAD_DIR = 'uploads'
export const MEDIA_UPLOAD_LIMIT = 20 * 1024 * 1024 // 20MB
export const MEDIA_UPLOAD_ALLOWED: RegExp = /jpeg|jpg|png|gif|webp|svg|pdf|mp4|mp3|ogg|wav/

export const MEDIA_TYPES_KEYS = ['image', 'document', 'video', 'audio'] as const
export type MediaType = typeof MEDIA_TYPES_KEYS[number]
export const MEDIA_TYPES_OBJECTS: { value: MediaType, label: string, icon?: string }[] = [
    { value: 'image', label: 'Image', icon: 'ic:round-image' },
    { value: 'document', label: 'Document', icon: 'ic:baseline-description' },
    { value: 'video', label: 'Vidéo', icon: 'ic:round-videocam' },
    { value: 'audio', label: 'Audio', icon: 'ic:round-audiotrack' },
]

export interface MediaAttributes {
    id: number
    file_name: string
    file_path: string
    type: MediaType
    mime_type: string
    size: number
    uploaded_by?: number | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type MediaAttributesCreation = Optional<MediaAttributes, 'id' | 'uploaded_by' | 'created_at' | 'updated_at'>
export type MediaAttributesUpdate = Optional<MediaAttributes, 'id' | 'file_name' | 'file_path' | 'type' | 'mime_type' | 'size' | 'uploaded_by' | 'created_at' | 'updated_at'>