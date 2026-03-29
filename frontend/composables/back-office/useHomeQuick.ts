import { paginationDefault } from '@brz/shared';
import type { HomeQuickAttributes, Order } from '@brz/shared'
import type { Pagination } from '@brz/shared'
import useApi from '~/composables/useApi'
import { useDebounce } from '../useDebounce';

const DEBOUNCE_DELAY = 600

export const useHomeQuicks = async () => {
    const page = ref(1)
    const order = ref<Order | null>(null)
    const search = ref<string>('')
    const limit = ref<number>(paginationDefault().limit)

    const { data, status, error, execute } = useLazyAsyncData(
        `home-quicks-${page.value}-${search.value}-${limit.value}`,
        () => useApi().get<{ data: HomeQuickAttributes[], pagination: Pagination }>(
            '/back-office/home-quicks',
            {
                params: {
                    page: page.value,
                    limit: limit.value,
                    order: order.value ? JSON.stringify([order.value]) : undefined,
                    search: search.value.trim(),
                    is_visible: 'all',
                }
            }
        ).then(r => r.data),
        { watch: [page, order] }
    )

    const { run: debouncedExecute } = useDebounce(execute, DEBOUNCE_DELAY)
    watch(search, debouncedExecute)

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
        homeQuicks: computed(() => data.value?.data ?? []),
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

export const useEditHomeQuick = async (id: number) => {
    const { data, status, error } = await useAsyncData(
        `home-quick-${id}`,
        () => useApi()
            .get<{ data: HomeQuickAttributes, pagination: Pagination }>(
                `/back-office/home-quicks/${id}`)
            .then(r => r.data),
    )

    const deleteSelf = async () => {
        const response = await useApi().delete(`/back-office/home-quicks/${id}`)

        if (!response.ok) throw response.error
        return true
    }

    const updateSelf = async (payload: Partial<HomeQuickAttributes>) => {
        const response = await useApi().put<{ data: HomeQuickAttributes }>(
            `/back-office/home-quicks/${id}`,
            { body: payload }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    return {
        homeQuick: computed(() => data.value?.data ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
        deleteSelf,
        updateSelf,
    }
}

export const useCreateHomeQuick = () => {
    const createSelf = async (payload: Partial<HomeQuickAttributes>) => {
        const response = await useApi().post<{ data: HomeQuickAttributes }>(
            '/back-office/home-quicks',
            { body: payload }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    return {
        createSelf
    }
}