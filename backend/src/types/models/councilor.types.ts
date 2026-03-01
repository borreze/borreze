import { Optional } from 'sequelize'

export interface CouncilorAttributes {
    id: number
    first_name: string
    last_name: string
    birth_date?: Date | null
    appointment_date: Date
    position: string
    picture_id?: number | null
    email?: string | null
    phone?: string | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type CouncilorAttributesCreation = Optional<CouncilorAttributes, 'id' | 'birth_date' | 'picture_id' | 'email' | 'phone' | 'created_at' | 'updated_at'>
export type CouncilorAttributesUpdate = Optional<CouncilorAttributes, 'id' | 'first_name' | 'last_name' | 'birth_date' | 'appointment_date' | 'position' | 'picture_id' | 'email' | 'phone' | 'created_at' | 'updated_at'>