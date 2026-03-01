export type day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type Time = `${number}${number}:${number}${number}`

export interface interval {
    start: Time
    end: Time
}

export interface ScheduleAttributes {
    id: number
    day: day
    intervals: interval[]
}