import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: true, // Ensures the dev server uses your machine's network IP
        https: true, // Enforces HTTPS in the local dev server
    },
    build: {
        sourcemap: true, // Enable source maps for debugging
    },
    resolve: {
        alias: {
            '@': '/resources/js', // Adjust the alias to match your project structure
        },
    },
});
