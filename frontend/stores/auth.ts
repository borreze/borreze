import { defineStore } from 'pinia'
import { useCookie } from '#app'
import useApiClient from '~/composables/useApiClient'
import type { User } from '~/types/models/user'

export interface RefreshData {
    accessToken: string
    refreshToken: string
}

export interface LoginData {
    accessToken: string
    refreshToken: string
    user: User
}

export interface AuthStoreState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    loading: boolean
    error: string | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthStoreState => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state): boolean => !!state.accessToken && !!state.user
    },

    actions: {
        /**
        * Fetch current user info using access token
        */
        async fetchMe() {
            if (!this.accessToken) return false

            this.error = null
            this.loading = true

            const api = useApiClient()
            const { status, data } = await api.get<{ data: User }>('/admin/auth/me', { silent: true })

            if (status === 200 && data) {
                this.user = data.data
                return true
            }

            this.error = 'Votre session a expiré, veuillez vous reconnecter'

            await this.logout()

            return false
        },

        /**
         * Login user
         */
        async login(identifier: string, password: string): Promise<boolean> {
            this.error = null
            this.loading = true

            const api = useApiClient()
            const { status, data } = await api.post<{ data: LoginData }>('/admin/auth/login', {
                body: { identifier, password },
                silent: true // to avoid being redirected to home on wrong credentials (handled by this action)
            })

            this.loading = false

            if (status === 200 && data) {
                const result = data.data
                this.user = result.user
                this.accessToken = result.accessToken
                this.refreshToken = result.refreshToken

                // SSR-safe persistence
                const accessCookie = useCookie('auth_access_token')
                const refreshCookie = useCookie('auth_refresh_token')
                const userCookie = useCookie<User | null>('auth_user', { default: () => null })
                accessCookie.value = result.accessToken
                refreshCookie.value = result.refreshToken
                userCookie.value = result.user

                return true
            }

            if (status === 401 || status === 400 || status === 404) {
                this.error = 'Les identifiants sont invalides'
            } else {
                this.error = 'Une erreur est survenue lors de la connexion'
            }

            return false
        },

        /**
         * Refresh access token using stored refresh token
         */
        async refresh() {
            const refreshCookie = useCookie('auth_refresh_token')
            if (!refreshCookie.value) return null

            const api = useApiClient()
            const { status, data } = await api.post<{ data: RefreshData }>('/admin/auth/refresh', {
                body: { refreshToken: refreshCookie.value }
            })

            if (status === 200 && data) {
                const tokens = data.data
                this.accessToken = tokens.accessToken
                this.refreshToken = tokens.refreshToken

                const accessCookie = useCookie('auth_access_token')
                accessCookie.value = tokens.accessToken
                refreshCookie.value = tokens.refreshToken

                return tokens
            }

            this.error = 'Votre session a expiré, veuillez vous reconnecter'
            await this.logout()
            return null
        },

        /**
         * Logout user and revoke refresh token
         */
        async logout(redirect: string = '/') {
            const refreshCookie = useCookie('auth_refresh_token')
            const api = useApiClient()

            if (refreshCookie.value) {
                await api.post('/admin/auth/logout', {
                    body: { refreshToken: refreshCookie.value }
                })
            }

            const accessCookie = useCookie('auth_access_token')
            accessCookie.value = null
            refreshCookie.value = null

            this.user = null
            this.accessToken = null
            this.refreshToken = null

            console.error(this.error)
            this.error = null

            if (redirect) await useRouter().push(redirect)
        },

        /**
         * Send password reset code to email
         */
        async sendResetCode(email: string) {
            this.loading = true

            const api = useApiClient()
            const { status } = await api.post('/admin/auth/send-reset-code', { body: { email } })

            this.loading = false

            return status === 200
        },

        /**
         * Reset password using email + code + new password
         */
        async resetPassword(email: string, code: string, newPassword: string) {
            this.loading = true

            const api = useApiClient()
            const { status } = await api.post('/admin/auth/reset-password', {
                body: { email, code, newPassword }
            })

            this.loading = false
            return status === 200
        },

        /**
         * Restore tokens from cookies on SSR/client init
         */
        loadFromCookies() {
            const accessCookie = useCookie('auth_access_token')
            const refreshCookie = useCookie('auth_refresh_token')
            const userCookie = useCookie<User | null>('auth_user')
            this.accessToken = accessCookie.value ?? null
            this.refreshToken = refreshCookie.value ?? null
            this.user = userCookie.value ?? null
        }
    }
})
