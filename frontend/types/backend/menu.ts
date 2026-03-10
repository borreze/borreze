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
    children?: MenuAttributes[] // ! Frontend only
}