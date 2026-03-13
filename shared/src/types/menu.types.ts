import { Optional } from 'sequelize'

export const MENU_CONTEXTS = ['front-office', 'back-office'] as const
export type MenuContext = typeof MENU_CONTEXTS[number]

export interface MenuAttributes {
    id: number
    context: MenuContext
    label: string
    url?: string | null
    parent_id?: number | null
    icon?: string | null
    order: number
    is_visible: boolean
    created_at?: Date | null
    updated_at?: Date | null
}

export type MenuAttributesCreation = Optional<MenuAttributes, 'id' | 'url' | 'parent_id' | 'icon' | 'created_at' | 'updated_at'>
export type MenuAttributesUpdate = Optional<MenuAttributes, 'id' | 'context' | 'label' | 'url' | 'parent_id' | 'icon' | 'order' | 'is_visible' | 'created_at' | 'updated_at'>