import { type PopupAttributes } from '@brz/shared';
import useApi from '~/composables/useApi'

export const usePopups = async () => {
    const { data, status, error } = await useAsyncData(
        `popups`,
        async () => {
            try {
                const res = await useApi().get<{ data: PopupAttributes[] }>('/popups')
                return res.data ?? null
            } catch (e) {
                return null
            }
        },
    )

    return {
        popup: computed(() => data.value?.data?.[0] ?? null),
        popups: computed(() => data.value?.data ?? []),
        loading: computed(() => status.value === 'pending'),
        error,
    }
}