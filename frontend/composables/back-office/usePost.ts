import { paginationDefault, type PostAttributesFrontend } from '@brz/shared';
import type { Order, PostStatus, PostType } from '@brz/shared'
import type { Pagination } from '@brz/shared'
import useApi from '~/composables/useApi'
import { useDebounce } from '../useDebounce';

const DEBOUNCE_DELAY = 600

export const usePosts = async (type: PostType) => {
    const page = ref(1)
    const order = ref<Order | null>(null)
    const search = ref<string>('')
    const limit = ref<number>(paginationDefault().limit)

    const { data, status, error, execute } = useLazyAsyncData(
        `posts-${page.value}-${type}-${search.value}-${limit.value}`,
        () => useApi().get<{ data: PostAttributesFrontend[], pagination: Pagination }>(
            `/back-office/posts/${type}`,
            {
                params: {
                    page: page.value,
                    limit: limit.value,
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

export const useEditPost = async (type: PostType, id: number) => {
    const { data, status, error } = await useAsyncData(
        `post-${type}-${id}`,
        () => useApi()
            .get<{ data: PostAttributesFrontend, pagination: Pagination }>(
                `/back-office/posts/${type}/${id}`,
                {
                    params: {
                        status: 'all',
                    }
                })
            .then(r => r.data),
    )

    const deleteSelf = async () => {
        const response = await useApi().delete(`/back-office/posts/${type}/${id}`)

        if (!response.ok) throw response.error
        return true
    }

    const updateSelf = async (payload: Partial<PostAttributesFrontend>) => {
        const response = await useApi().put<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${type}/${id}`,
            { body: payload }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    const updateStatus = async (status: PostStatus) => {
        const response = await useApi().put<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${type}/${id}/status`,
            { body: { status } }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    const updateCategories = async (ids: number[]) => {
        const response = await useApi().put<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${type}/${id}/categories`,
            { body: { ids } }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    const updateMedias = async (ids: number[]) => {
        const response = await useApi().put<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${type}/${id}/medias`,
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
        updateMedias,
    }
}

export const useCreatePost = (type: PostType) => {
    const createSelf = async (payload: Partial<PostAttributesFrontend>) => {
        const response = await useApi().post<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${type}`,
            { body: payload }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    const assignCategories = async (postId: number, ids: number[]) => {
        const response = await useApi().put<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${type}/${postId}/categories`,
            { body: { ids } }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    const assignMedias = async (postId: number, ids: number[]) => {
        const response = await useApi().put<{ data: PostAttributesFrontend }>(
            `/back-office/posts/${type}/${postId}/medias`,
            { body: { ids } }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    return {
        createSelf,
        assignCategories,
        assignMedias,
    }
}