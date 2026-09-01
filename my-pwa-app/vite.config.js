import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 4000, // Increases the Vite chunk size warning limit to 4MB
  },
  plugins: [
    react(),

    VitePWA({
      registerType: 'prompt',

      injectRegister: 'auto',

      includeAssets: [
        'pwa-192x192.png',
        'pwa-512x512.png'
      ],

      workbox: {
        maximumFileSizeToCacheInBytes: 4194304, // Fixes build error by allowing cache size up to 4MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/dummyjson\.com\/users/i,

            handler: 'NetworkFirst',

            options: {
              cacheName: 'dummy-json-users-cache',

              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 86400
              },

              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },

      manifest: {
        name: 'LearnHub',

        short_name: 'LearnHub',

        description: 'Personal Learning and Tutor App',

        theme_color: '#ffffff',

        background_color: '#ffffff',

        display: 'standalone',

        orientation: 'portrait',

        start_url: '/',

        scope: '/',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },

          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },

          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})