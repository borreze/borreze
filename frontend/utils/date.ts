import type { DateFormat } from "~/types/date"

export const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return ''

    const d = new Date(date)

    const options: Record<string, Intl.DateTimeFormatOptions> = {
        default: { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    }

    return new Intl.DateTimeFormat('fr-FR', options['default']).format(d)
}

export const formatDate = (date: Date | string | null | undefined, format: DateFormat = 'long'): string => {
    if (!date) return ''

    const d = new Date(date)

    const options: Record<string, Intl.DateTimeFormatOptions> = {
        short: { day: 'numeric', month: 'numeric', year: 'numeric' },
        long: { day: 'numeric', month: 'long', year: 'numeric' },
        full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    }

    return new Intl.DateTimeFormat('fr-FR', options[format]).format(d)
}

export const formatDateRelative = (date: Date | string | null | undefined, format: DateFormat = 'long'): string => {
    if (!date) return ''

    const d = new Date(date)
    const now = new Date()
    const diffMs = d.getTime() - now.getTime()
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24)) // positive = future, negative = past

    const abs = Math.abs(days)

    // Beyond 1 year — absolute date
    if (abs >= 365) return `Le ${formatDate(d, format)}`

    // Today
    if (abs === 0) return "Aujourd'hui"

    // Relative label
    const label = (n: number, unit: string) => days > 0 ? `Dans ${n} ${unit}` : `Il y a ${n} ${unit}`

    if (abs === 1) return days > 0 ? 'Demain' : 'Hier'
    if (abs === 2) return days > 0 ? 'Après-demain' : 'Avant-hier'
    if (abs < 7) return label(abs, 'jours')
    if (abs < 30) return label(Math.round(abs / 7), 'semaines')
    return label(Math.round(abs / 30), 'mois')
}

export const dateGetDay = (date: Date | string | null | undefined): number | null => {
    if (!date) return null

    const d = new Date(date)

    return d.getDate()
}

export const dateGetMonthShort = (date: Date | string | null | undefined): string => {
    if (!date) return ''

    const d = new Date(date)

    return d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')
}

export const datetimeGetTime = (date: Date | string | null | undefined): string => {
    if (!date) return ''

    const d = new Date(date)

    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
