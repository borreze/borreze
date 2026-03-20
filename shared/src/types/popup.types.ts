import { Optional } from 'sequelize'
import { MediaAttributes } from './media.types'

export interface PopupAttributes {
    id: number
    media_id?: number | null
    date_from?: Date | null
    date_to?: Date | null
    title: string
    content?: string | null
    is_active: boolean
    created_at?: Date | null
    updated_at?: Date | null
}

export interface PopupAttributesFrontend extends PopupAttributes { media?: MediaAttributes }
export type PopupAttributesCreation = Optional<PopupAttributes, 'id' | 'media_id' | 'date_from' | 'date_to' | 'content' | 'is_active' | 'created_at' | 'updated_at'>
export type PopupAttributesUpdate = Optional<PopupAttributes, 'id' | 'media_id' | 'date_from' | 'date_to' | 'title' | 'content' | 'is_active' | 'created_at' | 'updated_at'>