import type { ScheduleDay, ScheduleAttributes, Time } from "@brz/shared";

const days: Record<ScheduleDay, string> = {
    'monday': 'Lundi',
    'tuesday': 'Mardi',
    'wednesday': 'Mercredi',
    'thursday': 'Jeudi',
    'friday': 'Vendredi',
    'saturday': 'Samedi',
    'sunday': 'Dimanche'
}

export function niceDay(day: ScheduleDay): string {
    return days[day] || day
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
    const dayOrder: ScheduleDay[] = Object.keys(days) as ScheduleDay[]
    schedules.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))

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