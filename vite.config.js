import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
// https://vite.dev/config/
export default defineConfig({
    build: {
    chunkSizeWarningLimit: 1000, // increase limit to 1MB
  },
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        headers: {
            'Cache-Control': 'no-store',
        },
        proxy: {
            '/api': {
                target: process.env.VITE_DEV_API_PROXY || 'https://vaptbackend.secureitlab.com',
                changeOrigin: true,
                secure: false,
                configure: (proxy) => {
                    proxy.on('proxyRes', (proxyRes) => {
                        proxyRes.headers['cache-control'] = 'no-store, no-cache, must-revalidate, max-age=0';
                        proxyRes.headers['pragma'] = 'no-cache';
                        proxyRes.headers['expires'] = '0';
                    });
                },
            },
        },
    },
    preview: {
        headers: {
            'Cache-Control': 'no-store',
        },
    },
});
