import { Optional } from 'sequelize'

export const ROOM_RESERVATION_STATUSES_KEYS = ['pending', 'accepted', 'rejected'] as const
export type RoomReservationStatus = typeof ROOM_RESERVATION_STATUSES_KEYS[number]
export const ROOM_RESERVATION_STATUSES_OBJECTS: { value: RoomReservationStatus, label: string, color?: string }[] = [
    { value: 'accepted', label: 'Acceptée', color: '#349c17' },
    { value: 'pending', label: 'En attente', color: '#ffae00' },
    { value: 'rejected', label: 'Rejetée', color: '#ab0a0a' },
]

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