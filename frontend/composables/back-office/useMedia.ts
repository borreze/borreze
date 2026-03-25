import { paginationDefault, type MediaAttributes, type MediaType } from '@brz/shared'
import type { Order, Pagination } from '@brz/shared'
import { useDebounce } from '../useDebounce'

const DEBOUNCE_DELAY = 600

export const useMedias = async (options: { type?: MediaType | 'all' } = {}) => {
    const page = ref(1)
    const order = ref<Order | null>(null)
    const search = ref('')
    const type = ref<MediaType | 'all'>(options.type ?? 'all')

    const { data, status, error, execute } = useLazyAsyncData(
        `medias-page-${page.value}`,
        () => useApi().get<{ data: MediaAttributes[], pagination: Pagination }>(
            '/back-office/medias',
            {
                params: {
                    page: page.value,
                    limit: paginationDefault().limit,
                    order: order.value ? JSON.stringify([order.value]) : undefined,
                    search: search.value.trim(),
                    type: type.value,
                }
            }
        ).then(r => r.data),
        { watch: [page, order, type] }
    )

    const { run: debouncedExecute } = useDebounce(execute, DEBOUNCE_DELAY)
    watch(search, debouncedExecute)

    const setOrder = (newOrder: Order) => {
        order.value = newOrder;
        page.value = 1
    }

    const resetOrder = () => {
        order.value = null;
        page.value = 1
    }

    const setPage = (newPage: number) => {
        page.value = newPage;
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const setSearch = (newSearch: string) => {
        search.value = newSearch
        page.value = 1
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const resetSearch = () => {
        search.value = '';
        page.value = 1
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const setType = (newType: MediaType | 'all') => {
        type.value = newType;
        page.value = 1
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const resetType = () => {
        type.value = 'all';
        page.value = 1
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return {
        medias: computed(() => data.value?.data ?? []),
        pagination: computed(() => data.value?.pagination ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
        refresh: execute,
        setOrder,
        resetOrder,
        setPage,
        setSearch,
        resetSearch,
        setType,
        resetType,
    }
}

export const useEditMedia = async (id: number) => {
    const { data, status, error } = await useAsyncData(
        `media-${id}`,
        () => useApi().get<{ data: MediaAttributes }>(`/back-office/medias/${id}`).then(r => r.data),
    )

    const updateSelf = async (payload: Partial<MediaAttributes>) => {
        const response = await useApi().put<{ data: MediaAttributes }>(
            `/back-office/medias/${id}`,
            { body: payload }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    const deleteSelf = async () => {
        const response = await useApi().delete(`/back-office/medias/${id}`)
        if (!response.ok) throw response.error
        return true
    }

    return {
        media: computed(() => data.value?.data ?? null),
        loading: computed(() => status.value === 'pending'),
        error,
        updateSelf,
        deleteSelf,
    }
}

export const useCreateMedia = () => {
    const upload = async (file: File): Promise<MediaAttributes> => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await useApi().post<{ data: MediaAttributes }>(
            '/back-office/medias',
            { body: formData }
        )
        if (!response.ok) throw response.error
        return response.data!.data
    }

    const uploadMultiple = async (files: File[]): Promise<MediaAttributes[]> => {
        const formData = new FormData()
        files.forEach(f => formData.append('files', f))

        const response = await useApi().post<{ data: MediaAttributes[] }>(
            '/back-office/medias/multiple',
            { body: formData }
        )
        if (!response.ok) throw response.error
        return response.data!.data
    }

    return { upload, uploadMultiple }
}