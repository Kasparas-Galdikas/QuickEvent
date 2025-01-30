import axios from 'axios';
import '../css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import 'sweetalert2/dist/sweetalert2.min.css';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Get the CSRF token from the meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

// Set the CSRF token as a default header for Axios
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
} else {
    console.error('CSRF token not found: Ensure the meta tag is present in your HTML.');
}

// Attach Axios to the global window object for debugging or global usage
window.axios = axios;

// Function to refresh the CSRF token
const refreshCsrfToken = async () => {
    try {
        // Fetch a new CSRF token from Laravel's endpoint
        await axios.get('/sanctum/csrf-cookie');

        // Update the CSRF token in Axios headers
        const newCsrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (newCsrfToken) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = newCsrfToken;
        } else {
            console.error('CSRF token not found after refresh: Ensure the meta tag is updated.');
        }
    } catch (error) {
        console.error('Error refreshing CSRF token:', error);
    }
};

// Make the function available globally for use after logout
window.refreshCsrfToken = refreshCsrfToken;

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
