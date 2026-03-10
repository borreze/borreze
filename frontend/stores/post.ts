import { defineStore } from 'pinia'
import useApi from '~/composables/useApi'
import type { PostAttributes } from '~/types/backend/post'
import type { Pagination } from '~/types/pagination'

export interface PostStoreState {
    posts?: PostAttributes[] | null
    post?: PostAttributes | null
    pagination?: Pagination | null
    loading: boolean
    error: string | null
}

export const usePostStore = defineStore('post', {
    state: (): PostStoreState => ({
        posts: null,
        post: null,
        loading: true,
        error: null
    }),

    getters: {
        hasError: (state): boolean => !!state.error,
    },

    actions: {
        prepareForLoad() {
            this.loading = true
            this.error = null
        },

        resetData() {
            this.posts = null
            this.post = null
        },

        async setPage(page: number, fetch = true, scroll = true) {
            if (!this.pagination) this.pagination = PAGINATION_DEFAULT

            this.pagination.page = page
            if (fetch) await this.fetchPosts()
            if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' })
        },

        async fetchPosts(params: Record<string, any> = {}) {
            this.prepareForLoad()

            params = {
                limit: this.pagination?.limit || PAGINATION_DEFAULT.limit,
                page: this.pagination?.page || PAGINATION_DEFAULT.page,
                ...params
            }

            const api = useApi()
            const { status, data, } = await api.get<{ data: PostAttributes[], pagination: Pagination }>('/posts', { params })

            if (status === 200 && data) {
                this.posts = data.data
                this.pagination = data.pagination
            } else {
                this.error = 'Impossible de charger les posts'
            }

            this.loading = false

            return null
        },
    }
})
