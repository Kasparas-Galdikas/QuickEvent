<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Services\EventService;
use App\Models\Event;
use App\Models\Topic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\Group;

class EventServiceTest extends TestCase
{
    use RefreshDatabase;

    private EventService $eventService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->eventService = new EventService();
    }

    #[Test]
    public function it_processes_events_without_api()
    {
        // 🔹 Test event data (avoiding API calls)
        $eventData = [
            [
                'id' => '1',
                'title' => 'Tech Conference',
                'start' => now()->addDays(3)->toIso8601String(),
                'duration' => 7200,
                'description' => 'A technology conference.',
                'entities' => [['type' => 'venue', 'formatted_address' => 'Tech Hub, NY']],
                'category' => 'technology',
                'labels' => ['ai', 'innovation']
            ]
        ];

        // 🔹 Use the new **public wrapper** or call `processEvents()` directly
        $this->eventService->testProcessEvents($eventData);

        // ✅ Verify event is stored
        $this->assertDatabaseHas('events', [
            'title' => 'Tech Conference',
            'location' => 'Tech Hub, NY'
        ]);

        // ✅ Verify topics are linked
        $this->assertDatabaseHas('topics', ['name' => 'Technology']);
        $this->assertDatabaseHas('topics', ['name' => 'AI']);
    }

    #[Test]
    public function it_does_not_insert_duplicate_events()
    {
        // 🔹 Test event data
        $eventData = [
            [
                'id' => '3',
                'title' => 'Tech Conference',
                'start' => now()->addDays(3)->toIso8601String(),
                'duration' => 7200,
                'description' => 'A technology conference.',
                'entities' => [['type' => 'venue', 'formatted_address' => 'Tech Hub, NY']],
                'category' => 'technology',
                'labels' => ['ai', 'innovation']
            ]
        ];

        // 🔹 First insertion
        $this->eventService->testProcessEvents($eventData);

        // 🔹 Second insertion (should be blocked)
        $this->eventService->testProcessEvents($eventData);

        // ✅ Event should only exist **once** in DB
        $this->assertEquals(1, Event::where('title', 'Tech Conference')->count());
    }
}
