<?php

namespace App\Providers;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Vite;
use App\Models\Topic;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;  // Add Http facade for external request
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use App\Services\EventService;

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
        // Enforce HTTPS in production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Prefetch Vite assets if available
        if (method_exists(Vite::class, 'prefetch')) {
            Vite::prefetch(concurrency: 3);
        }

        // Share global data with Inertia
        Inertia::share([
            'auth' => function () {
                return [
                    'user' => Auth::check() ? Auth::user()->only(['id', 'name', 'email']) : null,
                ];
            },
            'app' => [
                'name' => config('app.name'),
            ],
        ]);

        // Use Bootstrap styling for pagination
        Paginator::useBootstrap();

        // Share app name with all Blade views
        View::share('appName', config('app.name'));

   
    }

   
}


