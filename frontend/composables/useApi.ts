import { $fetch } from 'ofetch'

type Params = Record<string, any>
type Headers = Record<string, string>
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiRequestOptions {
    params?: Params
    body?: any
    headers?: Headers
    defaulting?: boolean
    retry?: number
    silent?: boolean // if true, suppress global error notifications
}

interface ApiResponse<T> {
    status: number
    ok: boolean
    data?: T
    error?: any
}

/**
 * useApi — a robust, composable API utility for Nuxt
 */
export default function useApi() {
    const config = useRuntimeConfig()
    const API_BASE_URL = import.meta.server ? config.apiBaseUrl : config.public.apiBaseUrl

    const auth = useAuthStore()

    /** Default query params & headers */
    const defaultParams: Params = {}

    /** Default headers including auth token if available */
    const defaultHeaders: Headers = {
        'Content-Type': 'application/json',
        ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
    }

    /**
     * Unified request handler with retries and error handling
     */
    const request = async <T>(
        method: HttpMethod,
        endpoint: string,
        options: ApiRequestOptions = {},
    ): Promise<ApiResponse<T>> => {
        const {
            params,
            body,
            headers,
            defaulting = true,
            retry = 0,
            silent = false,
        } = options

        const finalParams = {
            ...(defaulting ? defaultParams : {}),
            ...params,
        }

        const finalHeaders = {
            ...(defaulting ? defaultHeaders : {}),
            ...headers,
        }

        // FormData : laisser le browser gérer Content-Type (multipart boundary)
        if (body instanceof FormData) {
            delete finalHeaders['Content-Type']
        }

        const url = `${API_BASE_URL}${endpoint}`
        let attempt = 0

        while (true) {
            try {
                const response = await $fetch.raw<T>(url, {
                    method,
                    params: finalParams,
                    body,
                    headers: finalHeaders,
                })

                return {
                    status: response.status,
                    ok: response.status >= 200 && response.status < 300,
                    data: response._data,
                }
            } catch (err: any) {
                const status = err?.response?.status ?? 0
                const data = err?.response?._data
                const error = { status, data }

                console.error(`API Error: ${url} (${method})`, error)

                if (!silent) {
                    if (status === 401) {
                        console.warn('Unauthorized, logging out...')
                        auth.logout()
                    } else if (status === 403) {
                        console.warn('Forbidden, logging out...')
                        auth.logout()
                    } else if (status >= 500) {
                        console.error('Server error, please try again later.')
                    }
                }

                if (attempt < retry) {
                    attempt++
                    console.warn(`Retrying request (${attempt}/${retry})...`)
                    continue
                }

                return { status, ok: false, error, data }
            }
        }
    }

    return {
        get: <T>(endpoint: string, options?: ApiRequestOptions) =>
            request<T>('GET', endpoint, options),
        post: <T>(endpoint: string, options?: ApiRequestOptions) =>
            request<T>('POST', endpoint, options),
        put: <T>(endpoint: string, options?: ApiRequestOptions) =>
            request<T>('PUT', endpoint, options),
        patch: <T>(endpoint: string, options?: ApiRequestOptions) =>
            request<T>('PATCH', endpoint, options),
        delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
            request<T>('DELETE', endpoint, options),
    }
}
