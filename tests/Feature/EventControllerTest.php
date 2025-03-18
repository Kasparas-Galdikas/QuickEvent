<?php

namespace Tests\Feature\Event;

use Tests\TestCase;
use App\Models\User;
use App\Models\Event;
use App\Models\Group;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;
use PHPUnit\Framework\Attributes\Test;

class EventControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_can_create_event()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user);

        $file = UploadedFile::fake()->image('event.jpg');

        $response = $this->post(route('events.store'), [
            'group_id' => $group->id,
            'title' => 'Test Event',
            'description' => 'This is a test event.',
            'start_date' => now()->addDay()->toDateTimeString(),
            'duration' => 2,
            'location' => 'Test Location',
            'type' => 'in-person',
            'image' => $file,
        ]);

        $response->assertRedirect(route('Home'));

        $this->assertDatabaseHas('events', [
            'title' => 'Test Event',
            'location' => 'Test Location',
        ]);
    }

    #[Test]
    public function event_cannot_be_created_without_existing_group()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('events.store'), [
            'group_id' => 9999, // Non-existent group
            'title' => 'Test Event',
            'description' => 'This is a test event.',
            'start_date' => now()->addDay()->toDateTimeString(),
            'duration' => 2,
            'location' => 'Test Location',
            'type' => 'in-person',
        ]);

        $response->assertSessionHasErrors('group_id');
    }

    #[Test]
    public function authorized_user_can_view_edit_page()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $user->id]);
        $event = Event::factory()->create(['group_id' => $group->id]);

        $this->actingAs($user);

        $response = $this->get(route('events.edit', $event->id));

        $response->assertStatus(200)
                 ->assertInertia(fn ($page) => $page->component('Events/EditEvent'));
    }

    #[Test]
    public function unauthorized_user_cannot_view_edit_page()
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $owner->id]);
        $event = Event::factory()->create(['group_id' => $group->id]);

        $this->actingAs($intruder);

        $response = $this->get(route('events.edit', $event->id));

        $response->assertStatus(302); // Redirected due to unauthorized access
    }

    #[Test]
    public function authorized_user_can_update_event()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $user->id]);
        $event = Event::factory()->create(['group_id' => $group->id]);
    
        $this->actingAs($user);
    
        $response = $this->put(route('events.update', $event->id), [
            'title' => 'Updated Event Title',
            'description' => 'Updated event description',
            'start_date' => now()->addDays(3)->toDateTimeString(),
            'duration' => 3,
            'location' => 'Updated Location',
        ]);
    
        // Fetch the event again after the update
        $updatedEvent = Event::find($event->id);
    
        $response->assertRedirect("/events/details/{$updatedEvent->slug}");
        $this->assertDatabaseHas('events', ['title' => 'Updated Event Title']);
    }
    

    #[Test]
    public function only_owner_can_delete_event()
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $owner->id]);
        $event = Event::factory()->create(['group_id' => $group->id]);

        $this->actingAs($intruder);

        $response = $this->delete(route('events.destroy', $event->id));

        $response->assertStatus(403); // Unauthorized
        $this->assertDatabaseHas('events', ['id' => $event->id]); // Event should still exist
    }

    #[Test]
    public function user_can_attend_event()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create();
        $event = Event::factory()->create(['group_id' => $group->id]);

        $this->actingAs($user);

        $response = $this->postJson(route('events.attend', $event->id));

        $response->assertStatus(200)
            ->assertJson(['message' => 'You are now attending this event']);

        $this->assertDatabaseHas('event_user', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }

    #[Test]
    public function user_can_unattend_event()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create();
        $event = Event::factory()->create(['group_id' => $group->id]);

        $event->attendees()->attach($user->id);

        $this->actingAs($user);

        $response = $this->deleteJson(route('events.unattend', $event->id));

        $response->assertStatus(200)
            ->assertJson(['message' => 'You have stopped attending this event']);

        $this->assertDatabaseMissing('event_user', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }

    #[Test]
    public function it_returns_event_attendees()
    {
        $event = Event::factory()->create();
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
    
        $event->attendees()->attach([$user1->id, $user2->id]);
    
        // Authenticate a user before making the request
        $this->actingAs($user1);
    
        $response = $this->get(route('events.attendees', $event->id));
    
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'attendees' => [
                         '*' => ['id', 'name', 'email']
                     ]
                 ]);
    }
    

    #[Test]
    public function it_returns_event_details_for_existing_event()
    {
        $group = Group::factory()->create();
        $event = Event::factory()->create([
            'group_id' => $group->id, 
            'slug' => 'test-event' // Ensure slug is set
        ]);
    
        $response = $this->get(route('events.details', $event->slug));
    
        $response->assertStatus(200)
                 ->assertInertia(fn ($page) =>
                     $page->component('Events/EventDetails')
                          ->has('event')
                          ->has('host')
                          ->has('topics')
                          ->has('group')
                          ->has('attendees')
                 );
    }
    
}
