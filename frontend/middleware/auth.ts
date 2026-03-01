export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        console.warn('Redirecting to home page because user is not authenticated')
        return navigateTo('/')
    }
})