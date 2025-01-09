<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | The paths, methods, and origins below determine the behavior of CORS
    | in your application. These settings define what is accessible to
    | external applications. Adjust them as per your requirements.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', '*'], // Apply CORS to these paths
    'allowed_methods' => ['*'], // Allow all HTTP methods
    'allowed_origins' => ['http://127.0.0.1:5173', 'http://localhost:5173'], // Allow Vite dev server
    'allowed_origins_patterns' => [], // No specific patterns needed for development
    'allowed_headers' => ['*'], // Allow all headers
    'exposed_headers' => [], // Headers that the browser can access
    'max_age' => 0, // Cache preflight requests for 0 seconds
    'supports_credentials' => true, // Allow credentials (e.g., cookies)
];
