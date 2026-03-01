// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite"

const project = {
  name: 'Borrèze',
  description: 'Site officiel de la commune de Borrèze.',
}

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: [
    '@/assets/css/main.css',
    'notivue/notifications.css',
    'notivue/animations.css'
  ],
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@vite-pwa/nuxt',
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL_SSR, // for SSR requests
    public: {
      project: {
        name: project.name,
        description: project.description,
      },
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL_CLIENT, // for client-side requests
      url: process.env.NUXT_PUBLIC_URL,
      siteUrl: process.env.NUXT_PUBLIC_URL,
      noIndex: (process.env.NUXT_PUBLIC_NOINDEX === 'true') || true,
    }
  },
  site: {
    indexable: process.env.NUXT_PUBLIC_NOINDEX !== 'true',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      watch: {
        usePolling: true
      },
      hmr: {
        host: '0.0.0.0',
        port: 5173,
      }
    }
  },
  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp'],
    alias: {
      '/default': '/images/placeholder.webp'
    },
    presets: {
      default: {
        modifiers: {
          format: 'webp',
          quality: 80,
          fit: 'cover'
        }
      }
    }
  },
  sitemap: process.env.NUXT_PUBLIC_NOINDEX === 'true'
    ? {}
    : {
      hostname: process.env.NUXT_PUBLIC_URL,
      gzip: true,
      exclude: [
        '/plan-du-site',
      ],
      defaults: {
        changefreq: 'weekly',
        priority: 0.5,
        lastmod: new Date()
      },
    },
  // nitro: {
  //   prerender: {
  //     crawlLinks: true,
  //     ignore: ['/robots.txt']
  //   }
  // },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: project.name,
      short_name: project.name,
      description: project.description,
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/pwa/web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      cleanupOutdatedCaches: true,
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'], // precache assets
      runtimeCaching: [
        {
          // Cache images
          urlPattern: ({ request }: { request: Request }) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 } // 7 days
          }
        }
      ]
    },
    devOptions: {
      enabled: true
    }
  }
})