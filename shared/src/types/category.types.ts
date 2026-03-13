import { Optional } from 'sequelize'

export interface CategoryAttributes {
    id: number
    name: string
    slug: string
    created_at?: Date | null
    updated_at?: Date | null
}

export type CategoryAttributesCreation = Optional<CategoryAttributes, 'id' | 'created_at' | 'updated_at'>
export type CategoryAttributesUpdate = Optional<CategoryAttributes, 'id' | 'name' | 'slug' | 'created_at' | 'updated_at'>