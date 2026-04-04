import { paginationDefault } from '@brz/shared';
import type { CategoryAttributes, Order } from '@brz/shared'
import type { Pagination } from '@brz/shared'
import useApi from '~/composables/useApi'
import { useDebounce } from '../useDebounce';

const DEBOUNCE_DELAY = 600

export const useCategories = async () => {
    const page = ref(1)
    const order = ref<Order | null>(null)
    const search = ref<string>('')
    const limit = ref<number>(paginationDefault().limit)

    const { data, status, error, execute } = useLazyAsyncData(
        `categories-${page.value}-${search.value}-${limit.value}`,
        () => useApi().get<{ data: CategoryAttributes[], pagination: Pagination }>(
            '/back-office/categories',
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
        categories: computed(() => data.value?.data ?? []),
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

export const useEditCategory = async (id: number) => {
    const { data, status, error } = await useAsyncData(
        `category-${id}`,
        () => useApi()
            .get<{ data: CategoryAttributes, pagination: Pagination }>(
                `/back-office/categories/${id}`)
            .then(r => r.data),
    )

    const deleteSelf = async () => {
        const response = await useApi().delete(`/back-office/categories/${id}`)

        if (!response.ok) throw response.error
        return true
    }

    const updateSelf = async (payload: Partial<CategoryAttributes>) => {
        const response = await useApi().put<{ data: CategoryAttributes }>(
            `/back-office/categories/${id}`,
            { body: payload }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    return {
        category: computed(() => data.value?.data ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
        deleteSelf,
        updateSelf,
    }
}

export const useCreateCategory = () => {
    const createSelf = async (payload: Partial<CategoryAttributes>) => {
        const response = await useApi().post<{ data: CategoryAttributes }>(
            '/back-office/categories',
            { body: payload }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    return {
        createSelf
    }
}

export const useCategoriesAll = async () => {
    const { data, status, error } = await useAsyncData(
        `categories-all`,
        async () => {
            try {
                const res = await useApi().get<{ data: CategoryAttributes[] }>(
                    '/back-office/categories',
                    {
                        params: {
                            page: 1,
                            limit: 999,
                        }
                    })
                return res.data ?? null
            } catch (e) {
                return null
            }
        },
    )

    return {
        categories: computed(() => data.value?.data ?? []),
        loading: computed(() => status.value === 'pending'),
        error,
    }
}