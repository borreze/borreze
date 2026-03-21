export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()
    authStore.loadFromCookies()
    
    if (to.path === '/back-office/authentification' && authStore.isAuthenticated) {
        console.warn('Redirecting to back-office page because user is already authenticated')
        return navigateTo('/back-office')
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        console.warn('Redirecting to home page because user is not authenticated')
        return navigateTo('/')
    }
})