import { type ScheduleAttributes, type ScheduleType } from '@brz/shared';
import useApi from '~/composables/useApi'

export const useSchedulesByType = async (type: ScheduleType) => {
    // TODO: cache results and invalidate cache when schedule is updated to avoid unnecessary API calls

    const { data, status, error } = await useAsyncData(
        `schedules-${type}`,
        async () => {
            try {
                const res = await useApi().get<{ data: ScheduleAttributes[] }>(`/schedules/${type}`)
                return res.data ?? null
            } catch (e) {
                return null
            }
        },
    )

    return {
        schedules: computed(() => data.value?.data ?? []),
        loading: computed(() => status.value === 'pending'),
        error,
    }
}