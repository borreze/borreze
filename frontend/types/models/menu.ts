export interface MenuAttributes {
    id: number
    label: string
    url?: string | null
    parent_id?: number | null
    order: number
    is_visible: boolean
    created_at?: Date | null
    updated_at?: Date | null
    children?: MenuAttributes[] // For nested menu items
}