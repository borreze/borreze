export interface PopupAttributes {
    id: number
    media_id?: number | null
    date_from?: Date
    date_to?: Date
    title: string
    content?: string | null
    is_active: boolean
    created_at?: Date | null
    updated_at?: Date | null
}