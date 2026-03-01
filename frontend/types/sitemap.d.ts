declare module '@nuxt/schema' {
    interface NuxtConfig {
        sitemap?: {
            hostname?: string
            gzip?: boolean
            exclude?: string[]
            defaults?: {
                changefreq?: string
                priority?: number
                lastmod?: Date
            }
            routes?: () => Promise<any[]>
        }
    }
}

export { }