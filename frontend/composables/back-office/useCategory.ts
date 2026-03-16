import { type CategoryAttributes } from '@brz/shared';
import useApi from '~/composables/useApi'

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