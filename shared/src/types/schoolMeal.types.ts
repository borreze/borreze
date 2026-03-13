import { Optional } from 'sequelize'

export interface SchoolMealAttributes {
    id: number
    date_start: Date
    menu_data: object
    pdf_id?: number | null
    is_archived: boolean
    created_at?: Date | null
    updated_at?: Date | null
}

export type SchoolMealAttributesCreation = Optional<SchoolMealAttributes, 'id' | 'pdf_id' | 'created_at' | 'updated_at'>
export type SchoolMealAttributesUpdate = Optional<SchoolMealAttributes, 'id' | 'date_start' | 'menu_data' | 'pdf_id' | 'is_archived' | 'created_at' | 'updated_at'>