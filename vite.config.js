import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'], // Input path for assets
            refresh: true, // Enable hot module replacement (HMR)
        }),
        react(),
    ],
    server: {
        host: '127.0.0.1', // Restrict the host to localhost
        port: 5173, // Use the standard Vite dev server port
        https: false, // Keep HTTPS false for now; set true if needed
        cors: true, // Enable CORS
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
