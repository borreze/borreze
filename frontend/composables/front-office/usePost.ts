import { paginationDefault, type PostAttributesFrontend } from '@brz/shared';
import type { Order, PostType } from '@brz/shared'
import type { Pagination } from '@brz/shared'
import useApi from '~/composables/useApi'

export const usePosts = async (type: PostType) => {
    const page = ref(1)
    const categories = ref<number[]>([])
    const order = ref<Order | null>(null)
    const limit = ref<number>(paginationDefault().limit)

    const { data, status, error } = await useAsyncData(
        `posts-${page.value}-${limit.value}-${categories.value.join(',')}`,
        async () => {
            try {
                const res = await useApi().get<{ data: PostAttributesFrontend[], pagination: Pagination }>(
                    `/posts/${type}/`,
                    {
                        params: {
                            page: page.value,
                            limit: limit.value,
                            categories: categories.value,
                            order: order.value ? JSON.stringify([order.value]) : undefined
                        }
                    }
                )
                return res.data ?? null
            } catch (e) {
                return null
            }
        },
        { watch: [page, categories, order] }
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

    const getCategories = () => {
        return categories.value
    }

    const removeCategory = (category: number) => {
        categories.value = categories.value.filter(c => c !== category)
        page.value = 1
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const addCategory = (category: number) => {
        if (!categories.value.includes(category)) {
            categories.value = [...categories.value, category]
            page.value = 1
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const resetCategories = () => {
        categories.value = []
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
        getCategories,
        addCategory,
        removeCategory,
        resetCategories,
    }
}

export const usePostsRecents = async (type: PostType) => {
    const { data, status, error } = await useAsyncData(
        `posts-recents-${type}`,
        async () => {
            try {
                const res = await useApi().get<{ data: PostAttributesFrontend[] }>(
                    `/posts/${type}/recents`
                )
                return res.data ?? null
            } catch (e) {
                return null
            }
        }
    )

    return {
        posts: computed(() => data.value?.data ?? []),
        loading: computed(() => status.value === 'pending'),
        error,
    }
}

export const usePostsFuture = async (type: PostType) => {
    const { data, status, error } = await useAsyncData(
        `posts-future-${type}`,
        async () => {
            try {
                const res = await useApi().get<{ data: PostAttributesFrontend[] }>(
                    `/posts/${type}/future`
                )
                return res.data ?? null
            } catch (e) {
                return null
            }
        }
    )

    return {
        posts: computed(() => data.value?.data ?? []),
        loading: computed(() => status.value === 'pending'),
        error,
    }
}

export const usePost = async (type: PostType, slug: string) => {
    const { data, status, error } = await useAsyncData(
        `post-${type}-${slug}`,
        async () => {
            try {
                const res = await useApi().get<{ data: PostAttributesFrontend }>(`/posts/${type}/${slug}`)
                return res.data ?? null
            } catch (e) {
                return null
            }
        }
    )

    return {
        post: computed(() => data.value?.data ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
    }
}