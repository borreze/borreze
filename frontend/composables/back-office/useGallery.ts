import { paginationDefault, type GalleryAttributesFrontend } from '@brz/shared';
import type { Order } from '@brz/shared'
import type { Pagination } from '@brz/shared'
import useApi from '~/composables/useApi'
import { useDebounce } from '../useDebounce';

const DEBOUNCE_DELAY = 600

export const useGalleries = async () => {
    const page = ref(1)
    const order = ref<Order | null>(null)
    const search = ref<string>('')
    const limit = ref<number>(paginationDefault().limit)

    const { data, status, error, execute } = useLazyAsyncData(
        `galleries-${page.value}-${search.value}-${limit.value}`,
        () => useApi().get<{ data: GalleryAttributesFrontend[], pagination: Pagination }>(
            '/back-office/galleries/',
            {
                params: {
                    page: page.value,
                    limit: limit.value,
                    order: order.value ? JSON.stringify([order.value]) : undefined,
                    search: search.value.trim(),
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
        galleries: computed(() => data.value?.data ?? []),
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

export const useEditGallery = async (id: number) => {
    const { data, status, error } = await useAsyncData(
        `gallery-${id}`,
        () => useApi()
            .get<{ data: GalleryAttributesFrontend, pagination: Pagination }>(`/back-office/galleries/${id}`)
            .then(r => r.data),
    )

    const deleteSelf = async () => {
        const response = await useApi().delete(`/back-office/galleries/${id}`)

        if (!response.ok) throw response.error
        return true
    }

    const updateSelf = async (payload: Partial<GalleryAttributesFrontend>) => {
        const response = await useApi().put<{ data: GalleryAttributesFrontend }>(
            `/back-office/galleries/${id}`,
            { body: payload }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    const updatePhotos = async (ids: number[]) => {
        const response = await useApi().put<{ data: GalleryAttributesFrontend }>(
            `/back-office/galleries/${id}/photos`,
            { body: { ids } }
        )

        if (!response.ok) throw response.error
        return response.data
    }

    return {
        gallery: computed(() => data.value?.data ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
        deleteSelf,
        updateSelf,
        updatePhotos,
    }
}

export const useCreateGallery = () => {
    const createSelf = async (payload: Partial<GalleryAttributesFrontend>) => {
        const response = await useApi().post<{ data: GalleryAttributesFrontend }>(
            '/back-office/galleries/',
            { body: payload }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    const assignPhotos = async (galleryId: number, ids: number[]) => {
        const response = await useApi().put<{ data: GalleryAttributesFrontend }>(
            `/back-office/galleries/${galleryId}/photos`,
            { body: { ids } }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    return {
        createSelf,
        assignPhotos
    }
}