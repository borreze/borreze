import type { PostAttributesFrontend } from '@brz/shared';
import type { Order } from '@brz/shared'
import type { Pagination } from '@brz/shared'
import useApi from '~/composables/useApi'
import { PAGINATION_DEFAULT } from '~/utils/pagination'

export const usePosts = async () => {
    const page = ref(1)
    const categories = ref<number[]>([])
    const order = ref<Order | null>(null)

    const { data, status, error } = await useAsyncData(
        `posts-page-${page.value}-categories-${categories.value.join(',')}`,
        async () => {
            try {
                const res = await useApi().get<{ data: PostAttributesFrontend[], pagination: Pagination }>(
                    '/posts',
                    {
                        params: {
                            page: page.value,
                            limit: PAGINATION_DEFAULT.limit,
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

export const usePostsRecents = async () => {
    const { data, status, error } = await useAsyncData(
        'posts-recents',
        async () => {
            try {
                const res = await useApi().get<{ data: PostAttributesFrontend[] }>(
                    '/posts/recents'
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

export const usePost = async (slug: string) => {
    const { data, status, error } = await useAsyncData(
        `post-${slug}`,
        async () => {
            try {
                const res = await useApi().get<{ data: PostAttributesFrontend }>(`/posts/${slug}`)
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