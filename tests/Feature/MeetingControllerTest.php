<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Inertia\Testing\AssertableInertia as Assert;

class MeetingControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_meeting_room_page_loads_correctly()
    {
        // Sukuriame vartotoją
        $user = User::factory()->create();

        // Prisijungiame kaip tas vartotojas
        $this->actingAs($user);

        // Imituojame meeting slug
        $slug = 'test-meeting-room';

        // Skambiname kontrolerio metodą
        $response = $this->get(route('meetings.show', ['slug' => $slug]));

        // Tikriname ar grąžinamas teisingas statusas
        $response->assertStatus(200);

        // Tikriname ar Inertia grąžina teisingus duomenis
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Meetings/MeetingRoom')
                 ->where('roomSlug', $slug)
                 ->where('userName', $user->name)
        );
    }
}
