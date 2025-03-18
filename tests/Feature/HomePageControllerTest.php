<?php

namespace Tests\Feature\Event;

use Tests\TestCase;
use App\Models\User;
use App\Models\Event;
use App\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;

class HomePageControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_fetch_events_for_calendar_returns_correct_data()
    {
        $date = now()->toDateString();
        $group = Group::factory()->create();
        
        Event::factory(5)->create(['group_id' => $group->id, 'event_date' => $date]); // 5 events
    
        $response = $this->getJson(url("/api/calendar-events?date={$date}&perPage=3&page=1"));
    
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'events',
            'pagination' => [
                'current_page',
                'last_page',
                'per_page',
                'total',
            ],
        ]);
        $this->assertCount(3, $response['events']); // Ensure pagination works
    }
    
    

    public function test_fetch_events_pagination_works()
    {
        $group = Group::factory()->create(); // Užtikrina, kad `group_id` egzistuoja
    
        Event::factory(15)->create(['group_id' => $group->id, 'event_date' => now()->addDays(1)->toDateString()]);
    
        $response = $this->getJson(url('/api/events?page=1'));
    
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'events',
            'pagination' => [
                'current_page',
                'last_page',
            ],
        ]);
        $this->assertCount(10, $response['events']); // Tikriname, kad grąžina 10 įvykių per puslapį
    }
    

    public function test_fetch_events_for_calendar_requires_valid_date()
    {
        $response = $this->getJson(url('/api/calendar-events?date=invalid-date'));
    
        $response->assertStatus(400);
        $response->assertJson(['error' => 'Invalid date provided']);
    }

    public function test_fetch_events_for_calendar_returns_correct_data_paginated() 
    {
        $date = now()->toDateString();
        $group = Group::factory()->create();
        Event::factory(5)->create(['group_id' => $group->id, 'event_date' => $date]); // 5 events for today

        $response = $this->getJson(route('api.calendar-events', [
            'date' => $date,
            'perPage' => 3,
            'page' => 1
        ]));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'events',
            'pagination' => [
                'current_page',
                'last_page',
                'per_page',
                'total',
            ],
        ]);
        $this->assertCount(3, $response['events']); // Ensure it paginates correctly
    }
}
