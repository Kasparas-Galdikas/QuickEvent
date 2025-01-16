<?php

namespace App\Services;


use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Event;
use App\Models\Topic;
use Illuminate\Support\Str;


class EventService
{
    /**
     * Main method to fetch and store events.
     */
    public function fetchAndStoreUpcomingEvents()
    {

        $this->cleanupExpiredEvents();

        $apiEventCount = Event::whereNull('group_id')->count(); // Only count API events
        $remainingEvents = max(0, 120 - $apiEventCount);

        if ($remainingEvents > 0) {
            $this->fetchAndProcessEvents($remainingEvents);
        } else {
            Log::info('Already have 120 API events. Skipping fetch.');
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
        $batchSize = 75; // Fetch 75 events per batch
        $processedIds = [];
        $totalFetched = 0;
    
        while ($totalFetched < $remainingEvents) {
            // Adjust batch limit for the final batch
            $batchLimit = min($batchSize, $remainingEvents - $totalFetched);
            $events = $this->fetchEventsFromAPI($batchLimit, $offset, $labels);
    
            if (empty($events)) {
                Log::info("No more events available to fetch.");
                break;
            }
    
            // Validate and store events
            $validEvents = array_filter($events, function ($event) use ($processedIds) {
                $eventId = $event['id'];
                $slug = $event['slug'] ?? Str::slug($event['title'] . '-' . $eventId);
                return !in_array($eventId, $processedIds) && !Event::where('slug', $slug)->exists();
            });
    
            $storedCount = $this->processEvents($validEvents, $processedIds);
    
            if ($storedCount > 0) {
                $totalFetched += $storedCount;
            } else {
                Log::info("No valid new events in this batch. Fetching another batch...");
            }
    
            Log::info('Fetch progress:', [
                'offset' => $offset,
                'batchLimit' => $batchLimit,
                'totalFetched' => $totalFetched,
                'remainingEvents' => $remainingEvents - $totalFetched,
            ]);
    
            $offset += $batchSize; // Increment the offset by 100 for the next batch
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
    private function fetchEventsFromAPI(int $limit, int $offset, array $labels): array
    {
        $queryParams = [
            'phq_label' => implode(',', $labels),
            'limit' => $limit,
            'sort' => 'start',
            'offset' => $offset,
            'start.gte' => now()->toIso8601String(), // Fetch only events starting from now
        ];

        Log::info('Sending request to PredictHQ API.', [
            'offset' => $offset,
            'limit' => $limit,
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
        $newEvents = [];
        $storedCount = 0;
    
        foreach ($events as $event) {
            $eventId = $event['id'];
    
            if (in_array($eventId, $processedIds)) {
                continue; // Skip already processed events
            }
    
            $processedIds[] = $eventId;
    
            $slug = $event['slug'] ?? Str::slug($event['title'] . '-' . $eventId);
            $address = $this->extractAddress($event);
    
            // Validate description and treat "Sourced from predicthq.com" as empty
            $description = $event['description'] ?? '';
            if (trim($description) === 'Sourced from predicthq.com') {
                $description = ''; // Treat as empty
            }
    
            // Validate required fields
            if (empty($event['title']) || empty($event['start']) || empty($event['duration']) ||
                empty($description) || empty($address)) {
                continue;
            }
    
            // Check for duplicates in the database
            if (Event::where('slug', $slug)->exists()) {
                continue; // Skip duplicates
            }
    
            $newEvents[] = [
                'title' => $event['title'],
                'event_date' => date('Y-m-d', strtotime($event['start'])),
                'event_time' => date('H:i:s', strtotime($event['start'])),
                'duration' => $event['duration'] ?? 0,
                'description' => $description, // Use the validated description
                'location' => $address,
                'slug' => $slug,
                'group_id' => null, // Mark as API event
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
    
        if (!empty($newEvents)) {
            Event::insert($newEvents); // Bulk insert new events
    
            foreach ($newEvents as $eventData) {
                // Retrieve the newly inserted event
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
}
