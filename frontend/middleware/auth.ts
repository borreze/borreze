export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()
    auth.loadFromCookies()
    
    if (to.path === '/back-office/authentification' && auth.isAuthenticated) {
        console.warn('Redirecting to back-office page because user is already authenticated')
        return navigateTo('/back-office')
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        console.log(to)
        console.warn('Redirecting to home page because user is not authenticated')
        return navigateTo('/')
    }
})