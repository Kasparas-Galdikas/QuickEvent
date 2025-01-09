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

        // Call the checkAndPopulateTopics function
        $this->checkAndPopulateTopics();
    }

    /**
     * Fetch topics and populate the database if empty.
     */
    private function checkAndPopulateTopics()
    {
        // Fetch all topics from the database
        $topics = Topic::all();

        // Only fetch from Eventbrite and populate the database if the table is empty
        if ($topics->isEmpty()) {
            try {
                // Fetch categories from Eventbrite if the topics table is empty
                $response = Http::withToken('UHBRQUQE7TUTW6WI5IYC')
                                ->get('https://www.eventbriteapi.com/v3/categories/');

                // Check if the request was successful
                if ($response->successful()) {
                    $categories = $response->json()['categories'];

                    // Loop through categories and store them in the topics table
                    foreach ($categories as $category) {
                        Topic::updateOrCreate(
                            ['name' => $category['name']],
                            ['name' => $category['name']]
                        );
                    }
                } else {
                    Log::error('Failed to fetch categories from Eventbrite');
                }
            } catch (\Exception $e) {
                Log::error('Error fetching categories from Eventbrite', ['error' => $e->getMessage()]);
            }
        }
    }
}
