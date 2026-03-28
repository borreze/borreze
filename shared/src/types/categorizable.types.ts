import { Optional } from 'sequelize'

export const CATEGORIZABLE_TYPES_KEYS = ['post'] as const
export type CategorizableType = typeof CATEGORIZABLE_TYPES_KEYS[number]
export const CATEGORIZABLE_TYPES_OBJECTS: { value: CategorizableType, }[] = [
    { value: 'post' },
]

export interface CategorizableAttributes {
    category_id: number
    categorizable_id: number
    type: CategorizableType
    created_at?: Date | null
    updated_at?: Date | null
}

export type CategorizableAttributesCreation = Optional<CategorizableAttributes, 'created_at' | 'updated_at'>
export type CategorizableAttributesUpdate = Optional<CategorizableAttributes, 'category_id' | 'categorizable_id' | 'type' | 'created_at' | 'updated_at'>