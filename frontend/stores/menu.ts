import { defineStore } from 'pinia'
import { useCookie } from '#app'
import useApi from '~/composables/useApi'
import type { MenuAttributesFrontend, MenuScope } from '@brz/shared'

const MENU_COOKIE_PREFIX = 'menus_'
const MENU_COOKIE_OPTIONS = { maxAge: 60 * 60 * 12 } // 12 hours

export interface MenuStoreState {
    menus: {
        [key in MenuScope]?: MenuAttributesFrontend[] | null
    }
    loading: boolean
    error: string | null
}

export const useMenuStore = defineStore('menu', {
    state: (): MenuStoreState => ({
        menus: {
            'back-office': null,
            'front-office': null
        },
        loading: false,
        error: null
    }),

    actions: {
        /**
         * Fetch menus from the API and update the state.
         * @param scope The scope of the menus to fetch (e.g. 'front-office' or 'back-office').
         * @returns A promise that resolves to true if the menus were fetched successfully, or false if an error occurred.
         */
        async fetchMenus(scope: MenuScope): Promise<boolean> {
            this.error = null
            this.loading = true

            const { status, data } = await useApi().get<{ data: MenuAttributesFrontend[] }>(`/menus/${scope}`)

            this.loading = false

            if (status === 200 && data) {
                // SSR-safe persistence
                const menusCookie = useCookie<MenuAttributesFrontend[] | null>(`${MENU_COOKIE_PREFIX}${scope}`, MENU_COOKIE_OPTIONS)
                menusCookie.value = data.data

                // Update state
                this.menus[scope] = data.data

                return true
            }

            this.error = 'Une erreur est survenue lors de la récupération des menus.'

            return false
        },

        /**
         * Store menus from cookies if available. This is useful for SSR hydration and client-side navigation without refetching from the API.
         */
        restoreMenus(scope: MenuScope) {
            const menusCookie = useCookie<MenuAttributesFrontend[] | null>(`${MENU_COOKIE_PREFIX}${scope}`, MENU_COOKIE_OPTIONS)
            if (menusCookie.value) this.menus[scope] = menusCookie.value
        },

        /**
         * Retrieve menus for a given scope, first attempting to restore from cookies, then fetching from the API if not already loaded.
         */
        loadMenus(scope: MenuScope) {
            this.restoreMenus(scope)

            if (this.menus[scope]) return

            this.fetchMenus(scope)
        },

        /**
         * Get menus for a specific scope.
         * @param scope The scope of the menus to retrieve (e.g. 'front-office' or 'back-office').
         * @returns The menus for the specified scope, or null if not found.
         */
        getMenusByScope(scope: MenuScope): MenuAttributesFrontend[] | null {
            return this.menus[scope] || null
        },

        /**
         * Delete all cookies related to menus. This can be used on logout to clear cached menus.
         */
        clearMenus(scope: MenuScope) {
            const menusCookie = useCookie<MenuAttributesFrontend[] | null>(`${MENU_COOKIE_PREFIX}${scope}`, MENU_COOKIE_OPTIONS)
            menusCookie.value = null
            this.menus[scope] = null
        }
    }
})
