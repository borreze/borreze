import { Optional } from 'sequelize'

export interface PageAttributeAttributes {
    id: number
    page_id: number
    key: string
    value?: string | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type PageAttributeAttributesCreation = Optional<PageAttributeAttributes, 'id' | 'value' | 'created_at' | 'updated_at'>
export type PageAttributeAttributesUpdate = Optional<PageAttributeAttributes, 'id' | 'page_id' | 'key' | 'value' | 'created_at' | 'updated_at'>