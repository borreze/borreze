import { type CategorizableType, type CategoryAttributes, type PostType } from '@brz/shared';
import useApi from '~/composables/useApi'

export const useCategoriesByType = async (type: CategorizableType, post?: PostType | null) => {
    const { data, status, error } = await useAsyncData(
        `categories-${type}${post ? `-${post}` : ''}`,
        async () => {
            try {
                const res = await useApi().get<{ data: CategoryAttributes[] }>(`/categories/${type}`,
                    {
                        params: {
                            post: post || undefined,
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