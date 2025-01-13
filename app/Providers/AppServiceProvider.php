<?php

namespace App\Providers;

use Illuminate\Support\Str;
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
use App\Models\Event;
use Illuminate\Support\Facades\Schema;

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

       // Ensure database tables exist before calling these methods
    if (Schema::hasTable('topics') && Schema::hasTable('events')) {
        // Call the checkAndPopulateTopics function
        $this->checkAndPopulateTopics();

        // Call the fetchAndStoreUpcomingEvents function
        $this->fetchAndStoreUpcomingEvents();
    }
    }

    /**
     * Fetch topics and populate the database if empty.
     */
    private function checkAndPopulateTopics()
    {
        // Define the cache key and the cache duration
        $cacheKey = 'topics';
        $cacheDuration = now()->addDay();

        // Retrieve cached topics or fetch from the database
        $topics = Cache::remember($cacheKey, $cacheDuration, function () {
            return Topic::all();
        });

        try {
            // Fetch categories from Eventbrite
            $response = Http::withToken('UHBRQUQE7TUTW6WI5IYC')
                ->get('https://www.eventbriteapi.com/v3/categories/');

            // Check if the request was successful
            if ($response->successful()) {
                $categories = $response->json()['categories'];

                // Check if all categories exist in the database
                $requiredTopicNames = collect($categories)->pluck('name');
                $existingTopicNames = $topics->pluck('name');

                // Determine missing topics
                $missingTopics = $requiredTopicNames->diff($existingTopicNames);

                // Add missing topics to the database
                if ($missingTopics->isNotEmpty()) {
                    foreach ($missingTopics as $missingTopic) {
                        Topic::create(['name' => $missingTopic]);
                    }

                    // Refresh the topics list and cache
                    $topics = Topic::all();
                    Cache::put($cacheKey, $topics, $cacheDuration);
                }
            } else {
                Log::error('Failed to fetch categories from Eventbrite');
            }
        } catch (\Exception $e) {
            Log::error('Error fetching categories from Eventbrite', ['error' => $e->getMessage()]);
        }

        return $topics;
    }

    /**
     * Main method to fetch and store events.
     */
    public function fetchAndStoreUpcomingEvents()
    {
        if (!$this->acquireLock()) {
            return;
        }

        $this->cleanupExpiredEvents();

        $remainingEvents = $this->calculateRemainingEvents(120);
        if ($remainingEvents <= 0) {
            Log::info('Events table already has 120 events or more. Skipping fetch.');
            return;
        }

        $this->fetchAndProcessEvents($remainingEvents);

        $this->releaseLock();
    }

    /**
     * Acquire a lock to ensure the method doesn’t run more than once an hour.
     *
     * @return bool
     */
    private function acquireLock(): bool
    {
        if (Cache::has('fetch_and_store_lock')) {
            Log::info('Skipping fetch; function ran within the last hour.');
            return false;
        }

        Cache::put('fetch_and_store_lock', true, now()->addHour());
        return true;
    }

    /**
     * Release the lock after execution.
     */
    private function releaseLock(): void
    {
        Cache::forget('fetch_and_store_lock');
    }

    /**
     * Clean up expired events from the database.
     */
    private function cleanupExpiredEvents(): void
    {
        Log::info('Cleaning up expired events...');

        $expiredEvents = Event::all();
        $deletedCount = 0;

        foreach ($expiredEvents as $event) {
            $eventEndDate = strtotime($event->event_date . ' ' . $event->event_time) + ($event->duration * 3600);
            if ($eventEndDate < time()) {
                Log::info('Deleting expired event:', ['slug' => $event->slug]);
                $event->delete();
                $deletedCount++;
            }
        }

        Log::info("Deleted $deletedCount expired events.");
    }

    /**
     * Calculate how many events are needed to reach the target count.
     *
     * @param int $targetCount
     * @return int
     */
    private function calculateRemainingEvents(int $targetCount): int
    {
        $currentEventCount = Event::count();
        Log::info("Current event count after cleanup: $currentEventCount");
        return max(0, $targetCount - $currentEventCount);
    }

    /**
     * Fetch and process events until the target count is reached.
     *
     * @param int $remainingEvents
     */
    private function fetchAndProcessEvents(int $remainingEvents): void
    {
        $labels = [
            'music',
            'business',
            'food',
            'community',
            'arts',
            'film',
            'sports',
            'health',
            'technology',
            'travel',
            'charity',
            'religion',
            'family',
            'holiday',
            'politics',
            'fashion',
            'lifestyle',
            'auto',
            'hobbies',
            'other',
            'school'
        ];

        $offset = 0;
        $limit = 50;
        $totalFetched = 0;
        $processedIds = [];

        while ($totalFetched < $remainingEvents) {
            $events = $this->fetchEventsFromAPI($remainingEvents, $offset, $limit, $labels);
            if (empty($events)) {
                break;
            }

            $totalFetched += $this->processEvents($events, $processedIds);
            $offset += $limit;
        }
    }

    /**
     * Fetch events from the PredictHQ API.
     *
     * @param int $remainingEvents
     * @param int $offset
     * @param int $limit
     * @param array $labels
     * @return array
     */
    private function fetchEventsFromAPI(int $remainingEvents, int $offset, int $limit, array $labels): array
    {
        $batchLimit = min($limit, $remainingEvents);
        $queryParams = [
            'phq_label' => implode(',', $labels),
            'limit' => $batchLimit,
            'sort' => 'start',
            'offset' => $offset,
        ];

        Log::info('Sending request to PredictHQ API.', [
            'offset' => $offset,
            'limit' => $batchLimit,
            'params' => $queryParams
        ]);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('PREDICTHQ_API_KEY'),
            'Accept' => 'application/json',
        ])->get('https://api.predicthq.com/v1/events/', $queryParams);

        if ($response->successful()) {
            return $response->json()['results'];
        }

        Log::error('Failed to fetch events from PredictHQ API.', [
            'status' => $response->status(),
            'response' => $response->body(),
        ]);

        return [];
    }

    /**
     * Process and store fetched events.
     *
     * @param array $events
     * @param array &$processedIds
     * @return int
     */
    private function processEvents(array $events, array &$processedIds): int
    {
        $storedCount = 0;

        foreach ($events as $event) {
            $eventId = $event['id'];

            if (in_array($eventId, $processedIds)) {
                continue;
            }

            $processedIds[] = $eventId;

            $slug = $event['slug'] ?? Str::slug($event['title'] . '-' . $eventId);
            $address = $this->extractAddress($event);

            $eventData = [
                'title' => $event['title'],
                'event_date' => date('Y-m-d', strtotime($event['start'])),
                'event_time' => date('H:i:s', strtotime($event['start'])),
                'duration' => $event['duration'] ?? 0,
                'description' => $event['description'] ?? '',
                'location' => $address ?? 'Unknown location',
                'image_path' => null,
                'slug' => $slug,
            ];

            try {
                $storedEvent = Event::updateOrCreate(['slug' => $slug], $eventData);

                if ($storedEvent->wasRecentlyCreated || $storedEvent->wasChanged()) {
                    $storedCount++;
                }

                $this->syncEventTopics($storedEvent, $event);
            } catch (\Exception $e) {
                Log::error('Failed to store event:', [
                    'error' => $e->getMessage(),
                    'event' => $eventData,
                ]);
            }
        }

        return $storedCount;
    }

    /**
     * Extract the address from the event.
     *
     * @param array $event
     * @return string|null
     */
    private function extractAddress(array $event): ?string
    {
        if (!empty($event['entities'])) {
            foreach ($event['entities'] as $entity) {
                if ($entity['type'] === 'venue' && isset($entity['formatted_address'])) {
                    return $entity['formatted_address'];
                }
            }
        }

        return null;
    }

    /**
     * Sync event topics (categories and labels) with the database.
     *
     * @param Event $storedEvent
     * @param array $event
     */
    private function syncEventTopics(Event $storedEvent, array $event): void
    {
        $phqCategory = $event['category'] ?? null;
        $phqLabels = $event['labels'] ?? [];

        if ($phqCategory) {
            $categoryName = ucwords(str_replace('-', ' ', $phqCategory));
            $categoryTopic = Topic::firstOrCreate(['name' => $categoryName]);
            $storedEvent->topics()->syncWithoutDetaching([$categoryTopic->id]);
        }

        foreach ($phqLabels as $labelValue) {
            $labelName = ucwords(str_replace('-', ' ', $labelValue));
            $labelTopic = Topic::firstOrCreate(['name' => $labelName]);
            $storedEvent->topics()->syncWithoutDetaching([$labelTopic->id]);
        }
    }
}


