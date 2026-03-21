export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore()

    authStore.loadFromCookies()

    if (authStore.accessToken && !authStore.user) {
        await authStore.fetchMe()
    }
})