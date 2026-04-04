import { Optional } from 'sequelize'
import { MediaAttributes } from './media.types'

export interface GalleryAttributes {
    id: number
    name: string
    created_at?: Date | null
    updated_at?: Date | null
}

export interface GalleryAttributesFrontend extends GalleryAttributes { photos?: MediaAttributes[]}
export type GalleryAttributesCreation = Optional<GalleryAttributes, 'id' | 'created_at' | 'updated_at'>
export type GalleryAttributesUpdate = Optional<GalleryAttributes, 'id' | 'name' | 'created_at' | 'updated_at'>