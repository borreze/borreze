import type { RouteRecordNormalized } from 'vue-router'
import { isQueryValid, type SearchResult } from '@brz/shared'
import useApi from '~/composables/useApi'
import { getRoutes } from '~/utils/routing'

const DEBOUNCE_DELAY = 400

export const useSearch = async (q: string) => {
    const query = ref<string>(q ?? '')

    const { data, status, error, execute } = await useAsyncData(
        `search`,
        async () => {
            if (!isQueryValid(query.value)) return null

            try {
                const res = await useApi().get<{ data: SearchResult[] }>(
                    '/global/search',
                    { params: { query: query.value } }
                )
                return res.data ?? null
            } catch (e) {
                return null
            }
        },
        { immediate: true }
    )

    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    watch(query, () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            execute()
        }, DEBOUNCE_DELAY)
    })

    const setQuery = (newQuery: string) => {
        query.value = newQuery
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const resetQuery = () => {
        query.value = ''
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const formatRouteAsSearchResult = (route: RouteRecordNormalized): SearchResult => ({
        title: route.meta?.title as string,
        _links: {
            self_front: route.path,
            self_api: '#',
            list_front: route.path,
            list_api: '#'
        },
        _names: {
            nice: 'Page',
            name: 'page',
            type: 'page'
        }
    })

    const routingResults: () => SearchResult[] = () => {
        const routes = getRoutes({ publicOnly: true, search: query.value })
        return routes.map(r => formatRouteAsSearchResult(r))
    }

    return {
        results: computed(() => {
            if (!data.value) return []
            const routeResults = routingResults()
            const apiResults = data.value?.data ?? []
            return [...apiResults, ...routeResults]
        }),
        loading: computed(() => status.value === 'pending'),
        error,
        setQuery,
        resetQuery,
    }
}