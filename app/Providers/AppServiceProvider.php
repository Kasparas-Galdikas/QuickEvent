<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Vite;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Prefetch Vite assets
        Vite::prefetch(concurrency: 3);

        // Enforce HTTPS in production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Share global data with Inertia
        Inertia::share([
            'auth' => function () {
                return [
                    'user' => Auth::check() ? Auth::user()->only(['id', 'name', 'email']) : null,
                ];
            },
        ]);

        // Use Bootstrap styling for pagination
        Paginator::useBootstrap();

        // Share app name with all views
        View::share('appName', config('app.name'));
    }
}
