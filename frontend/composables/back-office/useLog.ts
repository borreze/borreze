import { paginationDefault } from '@brz/shared';
import type { Order, LogAttributes } from '@brz/shared'
import type { Pagination } from '@brz/shared'
import useApi from '~/composables/useApi'

const DEBOUNCE_DELAY = 600

export const useLogs = async () => {
    const page = ref(1)
    const order = ref<Order | null>(null)
    const search = ref<string>('')

    const { data, status, error, execute } = useLazyAsyncData(
        `logs-page-${page.value}-search-${search.value}`,
        () => useApi().get<{ data: LogAttributes[], pagination: Pagination }>(
            '/back-office/logs',
            {
                params: {
                    page: page.value,
                    limit: paginationDefault().limit,
                    order: order.value ? JSON.stringify([order.value]) : undefined,
                    search: search.value.trim(),
                    is_active: 'all',
                }
            }
        ).then(r => r.data),
        { watch: [page, order] }
    )

    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    watch(search, () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            execute()
        }, DEBOUNCE_DELAY)
    })

    const setOrder = (newOrder: Order) => {
        order.value = newOrder
        page.value = 1
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const resetOrder = () => {
        order.value = null
        page.value = 1
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const setPage = (newPage: number) => {
        page.value = newPage
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const setSearch = (newSearch: string) => {
        search.value = newSearch
        page.value = 1
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const resetSearch = () => {
        search.value = ''
        page.value = 1
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return {
        logs: computed(() => data.value?.data ?? []),
        pagination: computed(() => data.value?.pagination ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
        setOrder,
        resetOrder,
        setPage,
        setSearch,
        resetSearch,
    }
}

export const useDetailLog = async (id: number) => {
    const { data, status, error } = await useAsyncData(
        `log-${id}`,
        () => useApi()
            .get<{ data: LogAttributes, pagination: Pagination }>(
                `/back-office/logs/${id}`)
            .then(r => r.data),
    )

    return {
        log: computed(() => data.value?.data ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
    }
}
