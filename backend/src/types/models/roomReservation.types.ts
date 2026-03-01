import { Optional } from 'sequelize'
import { ROOM_RESERVATION_STATUSES } from '../../models/roomReservation.model'

export type RoomReservationStatus = typeof ROOM_RESERVATION_STATUSES[number]

export interface RoomReservationAttributes {
    id: number
    applicant_name: string
    applicant_email: string
    applicant_phone: string
    date_start: Date
    date_end?: Date | null
    note?: string | null
    status: RoomReservationStatus
    created_at?: Date | null
    updated_at?: Date | null
}

export type RoomReservationAttributesCreation = Optional<RoomReservationAttributes, 'id' | 'note' | 'date_end' | 'created_at' | 'updated_at'>
export type RoomReservationAttributesUpdate = Optional<RoomReservationAttributes, 'id' | 'applicant_name' | 'applicant_email' | 'applicant_phone' | 'date_start' | 'note' | 'status' | 'created_at' | 'updated_at'>