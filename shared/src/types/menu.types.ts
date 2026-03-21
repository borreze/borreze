import { Optional } from 'sequelize'

export const MENU_SCOPES_KEYS = ['front-office', 'back-office'] as const
export type MenuScope = typeof MENU_SCOPES_KEYS[number]
export const MENU_SCOPES_OBJECTS: { value: MenuScope, label: string }[] = [
    { value: 'front-office', label: 'Front Office' },
    { value: 'back-office', label: 'Back Office' },
]

export interface MenuAttributes {
    id: number
    scope: MenuScope
    context?: string
    label: string
    url?: string | null
    parent_id?: number | null
    icon?: string | null
    order: number
    is_visible: boolean
    created_at?: Date | null
    updated_at?: Date | null
}

export interface MenuAttributesFrontend extends MenuAttributes { children?: MenuAttributes[] }
export type MenuAttributesCreation = Optional<MenuAttributes, 'id' | 'url' | 'context' | 'parent_id' | 'icon' | 'created_at' | 'updated_at'>
export type MenuAttributesUpdate = Optional<MenuAttributes, 'id' | 'scope' | 'context' | 'label' | 'url' | 'parent_id' | 'icon' | 'order' | 'is_visible' | 'created_at' | 'updated_at'>