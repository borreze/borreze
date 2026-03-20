import { paginationDefault } from '@brz/shared';
import type { Order, PopupAttributesFrontend } from '@brz/shared'
import type { Pagination } from '@brz/shared'
import useApi from '~/composables/useApi'

const DEBOUNCE_DELAY = 400

export const usePopups = async () => {
    const page = ref(1)
    const order = ref<Order | null>(null)
    const search = ref<string>('')

    const { data, status, error, execute } = useLazyAsyncData(
        `popups-page-${page.value}-search-${search.value}`,
        () => useApi().get<{ data: PopupAttributesFrontend[], pagination: Pagination }>(
            '/back-office/popups',
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
        popups: computed(() => data.value?.data ?? []),
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

export const useEditPopups = async (id: number) => {
    const { data, status, error } = await useAsyncData(
        `popup-${id}`,
        () => useApi()
            .get<{ data: PopupAttributesFrontend, pagination: Pagination }>(
                `/back-office/popups/${id}`)
            .then(r => r.data),
    )

    const deleteSelf = async () => {
        const response = await useApi().delete(`/back-office/popups/${id}`)

        if (!response.ok) throw response.error
        return true
    }

    const updateSelf = async (payload: Partial<PopupAttributesFrontend>) => {
        const response = await useApi().put<{ data: PopupAttributesFrontend }>(
            `/back-office/popups/${id}`,
            { body: payload }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    return {
        popup: computed(() => data.value?.data ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
        deleteSelf,
        updateSelf,
    }
}

export const useCreatePopup = () => {
    const createSelf = async (payload: Partial<PopupAttributesFrontend>) => {
        const response = await useApi().post<{ data: PopupAttributesFrontend }>(
            '/back-office/popups',
            { body: payload }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    return {
        createSelf
    }
}