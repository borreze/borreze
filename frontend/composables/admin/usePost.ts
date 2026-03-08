import type { PostAttributes } from '~/types/models/post'
import type { Order } from '~/types/order'
import type { Pagination } from '~/types/pagination'
import { PAGINATION_DEFAULT } from '~/utils/pagination'
import useApi from '~/composables/useApi'

export const usePosts = async () => {
    const page = ref(1)
    const order = ref<Order | null>(null)
    const search = ref<string>('')

    const { data, status, error, refresh } = useLazyAsyncData(
        `posts-page-${page.value}-search-${search.value}`,
        () => useApi().get<{ data: PostAttributes[], pagination: Pagination }>(
            '/admin/posts',
            {
                params: {
                    page: page.value,
                    limit: PAGINATION_DEFAULT.limit,
                    order: order.value ? JSON.stringify([order.value]) : undefined,
                    search: search.value,
                    status: 'all',
                }
            }
        ).then(r => r.data),
        { watch: [page, order, search] }
    )

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

    const create = async (payload: object) => {
        await useApi().post('/admin/posts', payload)
        await refresh()
    }

    const update = async (id: number, payload: object) => {
        await useApi().put(`/admin/posts/${id}`, payload)
        await refresh()
    }

    const remove = async (id: number) => {
        await useApi().delete(`/admin/posts/${id}`)
        await refresh()
    }

    return {
        posts: computed(() => data.value?.data ?? []),
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

export const usePost = async (id: number) => {
    const { data, status, error } = await useAsyncData(
        `post-${id}`,
        () => useApi()
            .get<{ data: PostAttributes[], pagination: Pagination }>(`/admin/posts/${id}`)
            .then(r => r.data),
    )

    return {
        post: computed(() => data.value?.data ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
    }
}