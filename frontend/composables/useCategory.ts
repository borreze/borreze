import type { CategorizableType, CategoryAttributes } from '~/types/models/category'
import type { Pagination } from '~/types/pagination'

export const useCategories = async () => {
    const page = ref(1)

    const { data, status, error } = await useAsyncData(
        `categories-page-${page.value}`,
        async () => {
            try {
                const res = await useApiClient().get<{ data: CategoryAttributes[], pagination: Pagination }>(
                    '/categories',
                    { params: { page: page.value, limit: PAGINATION_DEFAULT.limit } }
                )
                return res.data ?? null
            } catch (e) {
                return null
            }
        },
        { watch: [page] }
    )

    const setPage = (newPage: number) => {
        page.value = newPage
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return {
        categories: computed(() => data.value?.data ?? []),
        pagination: computed(() => data.value?.pagination ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
        setPage,
    }
}

export const useCategoriesByType = async (type: CategorizableType) => {
    const { data, status, error } = await useAsyncData(
        `categories-${type}`,
        async () => {
            try {
                const res = await useApiClient().get<{ data: CategoryAttributes[] }>(`/categories/${type}`)
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