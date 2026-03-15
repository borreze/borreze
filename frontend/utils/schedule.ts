import { type ScheduleDay, type ScheduleAttributes, type Time, SCHEDULE_DAYS_KEYS, SCHEDULE_DAYS_OBJECTS } from "@brz/shared";

export function niceDay(day: ScheduleDay): string {
    const dayObject = SCHEDULE_DAYS_OBJECTS.find(d => d.value === day)
    return dayObject ? dayObject.label : '--'
}

export function niceTime(time: Time): string {
    const [hour, minute] = time.split(':')

    if (!hour || !minute) return '--'

    if (minute === '00') return `${hour}h`
    return `${hour}h${minute}`
}

export function renderSchedules(schedules: ScheduleAttributes[]): string {
    let result = ''

    // Order schedules by day of the week
    schedules.sort((a, b) => SCHEDULE_DAYS_KEYS.indexOf(a.day) - SCHEDULE_DAYS_KEYS.indexOf(b.day))

        for (const schedule of schedules) {
        result += `Le ${niceDay(schedule.day)} : `

        for (const interval of schedule.intervals) {
            result += `de ${niceTime(interval.start)} à ${niceTime(interval.end)}, `
        }
        result = result.slice(0, -2) // remove the last comma and space

        result += '\n'
    }

    return result
}