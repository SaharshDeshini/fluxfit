import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'FluxFit',
                short_name: 'FluxFit',
                theme_color: '#000000',
                background_color: '#000000',
                display: 'standalone',
                orientation: 'portrait'
            }
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "unsafe-none"
        },
        proxy: {
            '/food-api': {
                target: 'https://world.openfoodfacts.org',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/food-api/, '')
            }
        }
    }
})
