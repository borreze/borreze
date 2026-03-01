import { useHead, useRuntimeConfig, useRoute } from '#imports'

type HeadOptionType = 'website' | 'article' | 'product' | string  // e.g., 'website', 'article', 'product'

interface HeadOptions {
    title?: string | null | undefined
    description?: string | null | undefined
    image?: string | null | undefined
    url?: string | null | undefined
    noindex?: boolean | null | undefined
    canonical?: string | null | undefined
    keywords?: string | null | undefined
    type?: HeadOptionType | null | undefined
    localeAlternateUrls?: Record<string, string> // e.g., { fr: '/fr', en: '/en' }
}

/**
 * useAppHead — SEO + Social Meta Composable
 * Centralized, extensible, and localized for large Nuxt projects
 */
export function useAppHead(options: HeadOptions = {}) {
    const config = useRuntimeConfig()
    const route = useRoute()

    const project = config.public.project

    // Base config (fallbacks from runtimeConfig)
    const defaults = {
        title: project.name,
        description: project.description,
        url: `${config.public.url}${route.fullPath}`,
        canonical: `${config.public.url}${route.fullPath}`,
        noindex: config.public.noIndex ?? false,
        type: 'website',
        keywords: 'borreze, dordogne',
    }

    // Merge options with defaults
    const meta = { ...defaults, ...options }

    // Meta tags
    const metaTags = [
        // Standard SEO
        { name: 'description', content: meta.description },
        { name: 'keywords', content: meta.keywords },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        // Open Graph (Facebook, LinkedIn)
        { property: 'og:type', content: meta.type },
        { property: 'og:site_name', content: project.name },
        { property: 'og:title', content: meta.title },
        { property: 'og:description', content: meta.description },
        { property: 'og:image', content: meta.image },
        { property: 'og:url', content: meta.url },
        { property: 'og:locale', content: 'fr_FR' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: meta.title },
        { name: 'twitter:description', content: meta.description },
        { name: 'twitter:image', content: meta.image },
    ]

    // Conditional noindex
    if (meta.noindex) {
        metaTags.push({ name: 'robots', content: 'noindex, nofollow' })
    }

    // Language alternates for multi-locale SEO
    const alternateLinks =
        meta.localeAlternateUrls &&
        Object.entries(meta.localeAlternateUrls).map(([lang, href]) => ({
            rel: 'alternate',
            hreflang: lang,
            href: `${config.public.url}${href}`,
        }))

    // Canonical link
    const linkTags = [
        { rel: 'canonical', href: meta.canonical },
        ...(alternateLinks || []),
    ]

    // Apply to head
    useHead({
        title: options.title ? `${options.title} - ${project.name}` : project.name,
        meta: metaTags.filter(tag => Boolean(tag.content)), // remove empty tags
        link: linkTags,
    })
}
