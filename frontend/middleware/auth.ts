export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()
    auth.loadFromCookies()
    
    if (to.path === '/admin/auth' && auth.isAuthenticated) {
        console.warn('Redirecting to admin page because user is already authenticated')
        return navigateTo('/admin')
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        console.warn('Redirecting to home page because user is not authenticated')
        return navigateTo('/')
    }
})