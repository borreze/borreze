import { Optional } from 'sequelize'

export const CATEGORIZABLE_TYPES = ['post', 'event', 'project', 'commerce', 'association'] as const
export type CategorizableType = typeof CATEGORIZABLE_TYPES[number]

export interface CategorizableAttributes {
    category_id: number
    categorizable_id: number
    type: CategorizableType
    created_at?: Date | null
    updated_at?: Date | null
}

export type CategorizableAttributesCreation = Optional<CategorizableAttributes, 'created_at' | 'updated_at'>
export type CategorizableAttributesUpdate = Optional<CategorizableAttributes, 'category_id' | 'categorizable_id' | 'type' | 'created_at' | 'updated_at'>