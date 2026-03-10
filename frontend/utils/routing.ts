import type { RouteRecordNormalized } from "vue-router"

export function isInBO() {
    const route = useRoute()
    return route.path.startsWith('/back-office')
}

export function isInFO() {
    const route = useRoute()
    return !route.path.startsWith('/back-office')
}

export function goBack() {
    useRouter().back()
}

export function goToSearchPage(query: string) {
    useRouter().push(`/recherche?q=${encodeURIComponent(query)}`)
}

export function goToHome() {
    if (isInBO()) {
        useRouter().push('/back-office')
    } else {
        useRouter().push('/')
    }
}

export function openInNewTab(path: string) {
    const url = new URL(path, window.location.origin).href
    window.open(url, '_blank')
}

export function getRoutes(options?: { publicOnly?: boolean, search?: string }): RouteRecordNormalized[] {
    const publicOnly = options?.publicOnly ?? true
    const search = options?.search ?? ''

    const router = useRouter()
    const allRoutes = router.getRoutes() as RouteRecordNormalized[]

    const seen = new Set()
    let filteredRoutes = allRoutes
        .filter(r => typeof r.path === 'string' && !r.path.startsWith('/_') && (typeof r.name !== 'string' || !r.name.startsWith('error'))) // Hide internal routes (e.g. /_internal) and error routes (e.g. name starts with 'error')
        .filter(r => !['()'].some(path => r.path.includes(path))) // Hide dynamic routes with parameters (e.g. /post/:id) or catch-all routes (e.g. /:pathMatch(.*)*)
        .filter(r => { // Remove duplicates
            if (seen.has(r.path)) return false
            seen.add(r.path)
            return true
        })
        .sort((a, b) => a.path.localeCompare(b.path)) // Sort alphabetically by path

    // Ensure there is meta.meta.title for all routes, defaulting to the path if not provided
    filteredRoutes.forEach(r => {
        if (!r.meta) r.meta = {}
        if (!r.meta.title) r.meta.title = r.path
    })

    if (publicOnly) {
        filteredRoutes = filteredRoutes.filter(r => {
            const meta = r.meta || {}
            return !meta.private
        })
    }

    if (search) {
        const lowerSearch = search.toLowerCase()
        filteredRoutes = filteredRoutes.filter(r => {
            return (
                (r.meta?.title as string)?.toLowerCase().includes(lowerSearch) ||
                r.path.toLowerCase().includes(lowerSearch)
            )
        })
    }

    return filteredRoutes
}