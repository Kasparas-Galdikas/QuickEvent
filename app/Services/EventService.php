<?php

namespace App\Services;


use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Event;
use App\Models\Topic;
use Illuminate\Support\Str;


class EventService
{

    private EventConfigService $config;

    public function __construct()
    {
        $this->config = EventConfigService::getInstance();
    }
    
    /**
     * Main method to fetch and store events.
     */
    public function fetchAndStoreUpcomingEvents()
    {
        $this->cleanupExpiredEvents();
    
        $apiEventCount = Event::whereNull('group_id')->count(); // Only count API events
        $remainingEvents = max(0, 180 - $apiEventCount); // fetch up to 180 events
    
        if ($remainingEvents > 0) {
            $this->fetchAndProcessEvents($remainingEvents);
        } else {
            Log::info('Already have 180 API events. Skipping fetch.');
        }
    }
    

    /**
     * Clean up expired events from the database.
     */
    private function cleanupExpiredEvents(): void
    {
        Log::info('Cleaning up expired events...');
        $now = now();
        $deletedCount = 0;

        $expiredEvents = Event::where(function ($query) use ($now) {
            $query->where('event_date', '<', $now->toDateString()) // Past events
                ->orWhere(function ($q) use ($now) {
                    $q->where('event_date', $now->toDateString()) // Today's events
                        ->whereRaw("TIMESTAMP(event_date, event_time) + INTERVAL duration SECOND < ?", [$now]);
                });
        })->get();

        foreach ($expiredEvents as $event) {
            $event->delete();
            $deletedCount++;
        }

        Log::info("Deleted $deletedCount expired events.");
    }

    /**
     * Fetch and process events until the target count is reached.
     *
     * @param int $remainingEvents
     */
    /**
     * Fetch and process events until the target count is reached.
     *
     * @param int $remainingEvents
     */
    private function fetchAndProcessEvents(int $remainingEvents): void
    {
        $labels = $this->config->getAllowedLabels();
        $countries = $this->config->getAllowedCountries();

        $offset = 0;
        $batchSize = 75;
        $totalFetched = 0;

        foreach ($countries as $country) {
            while ($totalFetched < $remainingEvents) {
                $batchLimit = min($batchSize, $remainingEvents - $totalFetched);
                $events = $this->fetchEventsFromAPI($batchLimit, $offset, $labels, $country);

                if (empty($events)) {
                    break;
                }

                $processedIds = []; // Initialize an empty array for tracking processed events
                $storedCount = $this->processEvents($events, $processedIds);
                $totalFetched += $storedCount;

                $offset += $batchSize;
            }

            $offset = 0;
            if ($totalFetched >= $remainingEvents) {
                break;
            }
        }
    }

    /**
     * Fetch events from the PredictHQ API.
     *
     * @param int $limit
     * @param int $offset
     * @param array $labels
     * @return array
     */
    private function fetchEventsFromAPI(int $limit, int $offset, array $labels, string $country): array
    {
        $queryParams = [
            'phq_label' => implode(',', $labels),
            'limit' => $limit,
            'sort' => 'start',
            'offset' => $offset,
            'start.gte' => now()->toIso8601String(),
            'country' => $country, // Single country code
        ];
    
        Log::info('Sending request to PredictHQ API.', [
            'country' => $country,
            'offset' => $offset,
            'limit' => $limit,
            'params' => $queryParams
        ]);
    
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('PREDICTHQ_API_KEY'),
            'Accept' => 'application/json',
        ])->get('https://api.predicthq.com/v1/events/', $queryParams);
    
        if ($response->successful()) {
            $results = $response->json()['results'];
            return $results;
        }
    
        Log::error('Failed to fetch events from PredictHQ API.', [
            'country' => $country,
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
        $newEvents = [];
        $storedCount = 0;
    
        foreach ($events as $event) {
            $eventId = $event['id'];
    
            if (in_array($eventId, $processedIds)) {
                continue;
            }
    
            $processedIds[] = $eventId;
    
            $slug = $event['slug'] ?? Str::slug($event['title'] . '-' . $eventId);
            $address = $this->extractAddress($event);
    
            $description = $event['description'] ?? '';
            if (trim($description) === 'Sourced from predicthq.com') {
                $description = ''; // Treat as empty
            }
    
            if (empty($event['title']) || empty($event['start']) || empty($event['duration']) ||
                empty($description) || empty($address)) {
                continue;
            }
    
            if (Event::where('slug', $slug)->exists()) {
                Log::info("Skipping event (duplicate slug):", [
                    'id' => $eventId,
                    'slug' => $slug,
                ]);
                continue;
            }
    
            $newEvents[] = [
                'title' => $event['title'],
                'event_date' => date('Y-m-d', strtotime($event['start'])),
                'event_time' => date('H:i:s', strtotime($event['start'])),
                'duration' => $event['duration'] ?? 0,
                'description' => $description,
                'location' => $address,
                'slug' => $slug,
                'group_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];

        }
    
        if (!empty($newEvents)) {
            Event::insert($newEvents);
            Log::info("Inserted events into the database:", [
                'count' => count($newEvents),
                'events' => array_column($newEvents, 'title'),
            ]);
    
            foreach ($newEvents as $eventData) {
                $storedEvent = Event::where('slug', $eventData['slug'])->first();
    
                if ($storedEvent) {
                    foreach ($events as $originalEvent) {
                        if (($originalEvent['slug'] ?? Str::slug($originalEvent['title'] . '-' . $originalEvent['id'])) === $eventData['slug']) {
                            $this->syncEventTopics($storedEvent, $originalEvent);
                            break;
                        }
                    }
                }
            }
    
            $storedCount = count($newEvents);
        }
    
        return $storedCount;
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

    public function testProcessEvents(array $events)
{
    $processedIds = [];
    return $this->processEvents($events, $processedIds);
}

}
