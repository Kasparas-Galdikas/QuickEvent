<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    |
    | Configure how your application handles cross-origin resource sharing
    | settings. These settings determine what cross-origin operations may
    | execute in web browsers. You are free to adjust these settings.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'build/*'], // Add your asset path here

    'allowed_methods' => ['*'],

 'allowed_origins' => ['http://127.0.0.1:5173', 'https://127.0.0.1:5173', 'http://localhost:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // Set to true if using cookies or credentials
];
