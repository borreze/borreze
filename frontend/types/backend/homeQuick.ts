export interface HomeQuickAttributes {
    id: number
    title: string
    url: string
    description: string
    icon: string
    order: number
    is_visible: boolean
    created_at?: Date | null
    updated_at?: Date | null
}
