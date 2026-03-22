import { paginationDefault, type UserAttributesFrontend } from '@brz/shared';
import type { Order, UserStatus } from '@brz/shared'
import type { Pagination } from '@brz/shared'
import useApi from '~/composables/useApi'

const DEBOUNCE_DELAY = 400

export const useUsers = async () => {
    const page = ref(1)
    const order = ref<Order | null>(null)
    const search = ref<string>('')

    const { data, status, error, execute } = useLazyAsyncData(
        `users-page-${page.value}-search-${search.value}`,
        () => useApi().get<{ data: UserAttributesFrontend[], pagination: Pagination }>(
            '/back-office/users',
            {
                params: {
                    page: page.value,
                    limit: paginationDefault().limit,
                    order: order.value ? JSON.stringify([order.value]) : undefined,
                    search: search.value.trim(),
                    status: 'all',
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
        users: computed(() => data.value?.data ?? []),
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

export const useEditUser = async (id: number) => {
    const { data, status, error } = await useAsyncData(
        `user-${id}`,
        () => useApi()
            .get<{ data: UserAttributesFrontend, pagination: Pagination }>(
                `/back-office/users/${id}`,
                {
                    params: {
                        status: 'all',
                    }
                })
            .then(r => r.data),
    )

    const deleteSelf = async () => {
        const response = await useApi().delete(`/back-office/users/${id}`)

        if (!response.ok) throw response.error
        return true
    }

    const updateSelf = async (payload: Partial<UserAttributesFrontend>) => {
        const response = await useApi().put<{ data: UserAttributesFrontend }>(
            `/back-office/users/${id}`,
            { body: payload }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    const updateStatus = async (status: UserStatus) => {
        const response = await useApi().put<{ data: UserAttributesFrontend }>(
            `/back-office/users/${id}/status`,
            { body: { status } }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    return {
        user: computed(() => data.value?.data ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
        deleteSelf,
        updateSelf,
        updateStatus
    }
}

export const useCreateUser = () => {
    const createSelf = async (payload: Partial<UserAttributesFrontend>) => {
        const response = await useApi().post<{ data: UserAttributesFrontend }>(
            '/back-office/users',
            { body: payload }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    return {
        createSelf
    }
}