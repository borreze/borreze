export default defineNuxtPlugin(async () => {
    const auth = useAuthStore()

    auth.loadFromCookies()

    if (auth.accessToken && !auth.user) {
        await auth.fetchMe()
    }
})