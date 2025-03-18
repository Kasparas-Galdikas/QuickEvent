<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Event;
use App\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SearchControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_returns_results_by_title()
    {
        $group = Group::factory()->create(); // Užtikrina, kad `group_id` egzistuoja
        
        Event::factory()->create([
            'group_id' => $group->id,
            'title' => 'Laravel Conference',
            'location' => 'New York'
        ]);
        
        Event::factory()->create([
            'group_id' => $group->id,
            'title' => 'PHP Meetup',
            'location' => 'Los Angeles'
        ]);

        $response = $this->getJson(route('api.search', ['query' => 'Laravel']));

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $this->assertEquals('Laravel Conference', $response['data'][0]['title']);
    }

    public function test_search_returns_results_by_location()
    {
        $group = Group::factory()->create(); // Sukuriame grupę
        
        Event::factory()->create([
            'group_id' => $group->id,
            'title' => 'Vue.js Conference',
            'location' => 'San Francisco'
        ]);
        
        Event::factory()->create([
            'group_id' => $group->id,
            'title' => 'React Workshop',
            'location' => 'San Francisco'
        ]);

        $response = $this->getJson(route('api.search', ['location' => 'San Francisco']));

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data'); // Turi būti 2 įvykiai
    }

    public function test_search_returns_results_by_title_and_location()
    {
        $group = Group::factory()->create(); // Užtikrina, kad `group_id` egzistuoja

        Event::factory()->create([
            'group_id' => $group->id,
            'title' => 'Angular Workshop',
            'location' => 'Chicago'
        ]);
        
        Event::factory()->create([
            'group_id' => $group->id,
            'title' => 'Angular Bootcamp',
            'location' => 'New York'
        ]);
        
        Event::factory()->create([
            'group_id' => $group->id,
            'title' => 'Vue.js Bootcamp',
            'location' => 'Chicago'
        ]);

        $response = $this->getJson(route('api.search', [
            'query' => 'Angular',
            'location' => 'Chicago'
        ]));

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $this->assertEquals('Angular Workshop', $response['data'][0]['title']);
    }

    public function test_search_fails_if_no_query_or_location_provided()
    {
        $response = $this->getJson(route('api.search'));

        $response->assertStatus(400);
        $response->assertJson(['error' => 'Search query or location is required']);
    }
}
