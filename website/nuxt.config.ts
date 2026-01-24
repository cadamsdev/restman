// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon'],
  app: {
    head: {
      title: 'RestMan - REST API Client for the Terminal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'RestMan is a powerful Terminal User Interface (TUI) REST API client built with Bun. Think Postman for the terminal.',
        },
        { property: 'og:title', content: 'RestMan - REST API Client for the Terminal' },
        {
          property: 'og:description',
          content: 'A powerful TUI REST API client for developers who live in the terminal',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  nitro: {
    prerender: {
      routes: ['/install.sh', '/install.ps1'],
    },
  },
});
