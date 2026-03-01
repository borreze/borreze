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

export const formatDateRelativeNice = (date: Date | string | null | undefined): string => {
    if (!date) return ''

    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) { // If the date is in the past, show relative time
        if (days === 0) return "Aujourd'hui"
        if (days === 1) return 'Hier'
        if (days === 2) return 'Avant-hier'
        if (days < 7) return `Il y a ${days} jours`
        if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`
        if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`
    }

    return `Le ${formatDate(d, 'long')}`
}
