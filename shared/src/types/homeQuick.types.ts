import { Optional } from 'sequelize'

export interface HomeQuickAttributes {
    id: number
    title: string
    url: string
    description?: string | null
    icon: string
    order: number
    is_visible: boolean
    created_at?: Date | null
    updated_at?: Date | null
}

export type HomeQuickAttributesCreation = Optional<HomeQuickAttributes, 'id' | 'description' | 'created_at' | 'updated_at'>
export type HomeQuickAttributesUpdate = Optional<HomeQuickAttributes, 'id' | 'title' | 'url' | 'description' | 'icon' | 'order' | 'is_visible' | 'created_at' | 'updated_at'>