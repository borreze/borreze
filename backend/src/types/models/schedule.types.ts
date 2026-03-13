import { Optional } from 'sequelize'

export const SCHEDULE_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
export type ScheduleDay = typeof SCHEDULE_DAYS[number]
export const SCHEDULE_TYPES = ['town_hall', 'commerce', 'school_childcare'] as const
export type ScheduleType = typeof SCHEDULE_TYPES[number]

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