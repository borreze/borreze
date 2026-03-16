import { Optional } from 'sequelize'

export const SCHEDULE_DAYS_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
export type ScheduleDay = typeof SCHEDULE_DAYS_KEYS[number]
export const SCHEDULE_DAYS_OBJECTS: { value: ScheduleDay, label: string }[] = [
    { value: 'monday', label: 'Lundi' },
    { value: 'tuesday', label: 'Mardi' },
    { value: 'wednesday', label: 'Mercredi' },
    { value: 'thursday', label: 'Jeudi' },
    { value: 'friday', label: 'Vendredi' },
    { value: 'saturday', label: 'Samedi' },
    { value: 'sunday', label: 'Dimanche' },
]

export const SCHEDULE_TYPES_KEYS = ['town_hall', 'commerce', 'school_childcare'] as const
export type ScheduleType = typeof SCHEDULE_TYPES_KEYS[number]
export const SCHEDULE_TYPES_OBJECTS: { value: ScheduleType, label: string, icon?: string }[] = [
    { value: 'town_hall', label: 'Mairie', icon: 'ic:baseline-apartment' },
    { value: 'commerce', label: 'Commerce', icon: 'ic:baseline-store' },
    { value: 'school_childcare', label: 'Garderie scolaire', icon: 'ic:baseline-school' },
]

export type Time = `${number}${number}:${number}${number}`

export interface TimeInterval {
    start: Time
    end: Time
}

export interface ScheduleAttributes {
    id: number
    type: ScheduleType
    commerce_id?: number
    day: ScheduleDay
    intervals: TimeInterval[]
    created_at?: Date | null
    updated_at?: Date | null
}

export type ScheduleAttributesCreation = Optional<ScheduleAttributes, 'id' | 'commerce_id' | 'created_at' | 'updated_at'>
export type ScheduleAttributesUpdate = Optional<ScheduleAttributes, 'id' | 'type' | 'commerce_id' | 'day' | 'intervals' | 'created_at' | 'updated_at'>