import type { ContactRequest } from '@brz/shared'
import useApi from '~/composables/useApi'

export const useContact = () => {
    const sendContact = async (data: ContactRequest) => {
        const response = await useApi().post<{ data: ContactRequest }>(
            '/contact',
            { body: data }
        )
        if (!response.ok) throw response.error
        return response.data
    }

    return {
        sendContact,
    }
}