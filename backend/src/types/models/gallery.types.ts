import { Optional } from 'sequelize'

export interface GalleryAttributes {
    id: number
    name: string
    created_at?: Date | null
    updated_at?: Date | null
}

export type GalleryAttributesCreation = Optional<GalleryAttributes, 'id' | 'created_at' | 'updated_at'>
export type GalleryAttributesUpdate = Optional<GalleryAttributes, 'id' | 'name' | 'created_at' | 'updated_at'>