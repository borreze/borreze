import { type CategorizableType, type CategoryAttributes } from '@brz/shared';
import useApi from '~/composables/useApi'

export const useCategoriesByType = async (type: CategorizableType) => {
    const { data, status, error } = await useAsyncData(
        `categories-${type}`,
        async () => {
            try {
                const res = await useApi().get<{ data: CategoryAttributes[] }>(`/categories/${type}`)
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