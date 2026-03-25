import { paginationDefault, type PostAttributesFrontend } from '@brz/shared';
import type { Order, PostStatus } from '@brz/shared'
import type { Pagination } from '@brz/shared'
import useApi from '~/composables/useApi'
import { useDebounce } from '../useDebounce';

const DEBOUNCE_DELAY = 600

export const usePosts = async () => {
    const page = ref(1)
    const order = ref<Order | null>(null)
    const search = ref<string>('')

    const { data, status, error, execute } = useLazyAsyncData(
        `posts-page-${page.value}-search-${search.value}`,
        () => useApi().get<{ data: PostAttributesFrontend[], pagination: Pagination }>(
            '/back-office/posts',
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

export const useEditPost = async (id: number) => {
    const { data, status, error } = await useAsyncData(
        `post-${id}`,
        () => useApi()
            .get<{ data: PostAttributesFrontend, pagination: Pagination }>(
                `/back-office/posts/${id}`,
                {
                    params: {
                        status: 'all',
                    }
                })
            .then(r => r.data),
    )

    const deleteSelf = async () => {
        const response = await useApi().delete(`/back-office/posts/${id}`)

        if (!response.ok) throw response.error
        return true
    }

    const updateSelf = async (payload: Partial<PostAttributesFrontend>) => {
        const response = await useApi().put<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${id}`,
            { body: payload }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    const updateStatus = async (status: PostStatus) => {
        const response = await useApi().put<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${id}/status`,
            { body: { status } }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    const updateCategories = async (ids: number[]) => {
        const response = await useApi().put<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${id}/categories`,
            { body: { ids } }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    return {
        post: computed(() => data.value?.data ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
        deleteSelf,
        updateSelf,
        updateStatus,
        updateCategories,
    }
}

export const useCreatePost = () => {
    const createSelf = async (payload: Partial<PostAttributesFrontend>) => {
        const response = await useApi().post<{ data: PostAttributesFrontend }>(
            '/back-office/posts',
            { body: payload }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    const assignCategories = async (postId: number, ids: number[]) => {
        const response = await useApi().put<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${postId}/categories`,
            { body: { ids } }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    return {
        createSelf,
        assignCategories
    }
}