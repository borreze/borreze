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
  build: {
    transpile: ['@brz/shared']
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
      '/default': '/utils/placeholder.webp'
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
})