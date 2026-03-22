import { type RoleAttributes } from '@brz/shared';
import useApi from '~/composables/useApi'

export const useRolesAll = async () => {
    const { data, status, error } = await useAsyncData(
        `roles-all`,
        async () => {
            try {
                const res = await useApi().get<{ data: RoleAttributes[] }>(
                    '/back-office/roles',
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
        roles: computed(() => data.value?.data ?? []),
        loading: computed(() => status.value === 'pending'),
        error,
    }
}