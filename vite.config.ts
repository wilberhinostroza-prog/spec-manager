//aplicaciones/spec-manager/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el repo bajo subruta: /spec-manager/
  base: '/spec-manager/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Spec Manager',
        short_name: 'SpecMgr',
        description: 'Gestor local de especificaciones de proyectos de software',
        start_url: '/spec-manager/',
        scope: '/spec-manager/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Precache completo: tras la 1ra carga la app funciona 100% offline
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}']
      }
    })
  ]
})