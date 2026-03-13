import { Optional } from "sequelize"

export interface GalleryMediaAttributes {
    gallery_id: number
    media_id: number
    order?: number | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type GalleryMediaAttributesCreation = Optional<GalleryMediaAttributes, 'created_at' | 'updated_at'>
export type GalleryMediaAttributesUpdate = Optional<GalleryMediaAttributes, 'gallery_id' | 'media_id' | 'order' | 'created_at' | 'updated_at'>