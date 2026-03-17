import { type HomeQuickAttributes } from '@brz/shared';
import useApi from '~/composables/useApi'

export const useHomeQuicks = async () => {
    const { data, status, error } = await useAsyncData(
        `home-quicks`,
        async () => {
            try {
                const res = await useApi().get<{ data: HomeQuickAttributes[] }>('/home-quicks')
                return res.data ?? null
            } catch (e) {
                return null
            }
        },
    )

    return {
        homeQuicks: computed(() => data.value?.data ?? []),
        loading: computed(() => status.value === 'pending'),
        error,
    }
}