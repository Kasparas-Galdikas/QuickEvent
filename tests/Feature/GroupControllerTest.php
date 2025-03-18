<?php

namespace Tests\Feature\Group;

use Tests\TestCase;
use App\Models\Group;
use App\Models\User;
use App\Models\Topic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;

class GroupControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_inertia_index_with_groups()
    {
        // Disable checking that the Inertia component file exists
        config(['inertia.testing.ensure_pages_exist' => false]);

        // Authenticate a user since the route is protected.
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create 3 groups in the database.
        Group::factory()->count(3)->create();

        $response = $this->get(route('groups.index'));

        $response->assertStatus(200)
                 ->assertInertia(fn (Assert $page) =>
                     $page->component('Groups/Index')
                          ->has('groups', 3)
                 );
    }

    #[Test]
    public function it_returns_group_json_for_existing_group()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $group = Group::factory()->create();

        // Use the defined route name 'groups.show.group'
        $response = $this->get(route('groups.show.group', ['id' => $group->id]));

        $response->assertStatus(200)
                 ->assertJson([
                     'id'   => $group->id,
                     'name' => $group->name,
                 ]);
    }

    #[Test]
    public function it_returns_404_for_nonexistent_group_in_show()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Request a group ID that doesn't exist.
        $response = $this->get(route('groups.show.group', ['id' => 999]));

        $response->assertStatus(404)
                 ->assertJson(['error' => 'Group not found']);
    }

    #[Test]
    public function it_creates_a_new_group_and_attaches_topics()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create topics to attach.
        $topics = Topic::factory()->count(2)->create();

        $data = [
            'groupName'        => 'Test Group',
            // Ensure description meets the validation minimum length (50 characters).
            'groupDescription' => str_repeat('a', 50),
            'location'         => 'Test Location',
            'topics'           => $topics->pluck('id')->toArray(),
        ];

        $response = $this->post(route('groups.store'), $data);

        // Expect a redirect to '/Home'
        $response->assertRedirect('/Home');

        // Verify the group exists in the database.
        $this->assertDatabaseHas('groups', [
            'name'        => 'Test Group',
            'description' => str_repeat('a', 50),
            'location'    => 'Test Location',
            'user_id'     => $user->id,
        ]);

        // Verify topics are attached in the pivot table "group_topic".
        $group = Group::where('name', 'Test Group')->first();
        foreach ($topics as $topic) {
            $this->assertDatabaseHas('group_topic', [
                'group_id' => $group->id,
                'topic_id' => $topic->id,
            ]);
        }
    }

    #[Test]
    public function it_sets_group_id_in_session_and_redirects_to_events_create()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $group = Group::factory()->create();

        // Use the defined route name 'groups.setGroupId'
        $response = $this->get(route('groups.setGroupId', $group->id));

        // The route 'events.create' should exist; the user is redirected there.
        $response->assertRedirect(route('events.create'));

        // Check that the group_id is stored in the session.
        $this->assertEquals($group->id, session('group_id'));
    }
}
