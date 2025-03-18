<?php

namespace Tests\Feature\Http\Controllers\Group;

use Tests\TestCase;
use App\Models\Group;
use App\Models\User;
use App\Models\Topic;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class GroupDetailControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_displays_a_group_details_page()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('groups.show.details', ['id' => $group->id]));

        $response->assertStatus(200)
                 ->assertInertia(fn (Assert $page) =>
                    $page->component('Groups/Show')
                         ->has('group', fn (Assert $groupData) =>
                             $groupData->where('id', $group->id)
                                       ->where('name', $group->name)
                                       ->etc()
                         )
                 );
    }

    #[Test]
    public function it_allows_the_group_owner_to_edit_the_group()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('groups.edit', $group->id));

        $response->assertStatus(200)
                 ->assertInertia(fn (Assert $page) =>
                    $page->component('Groups/EditGroup')
                         ->has('group', fn (Assert $groupData) =>
                             $groupData->where('id', $group->id)
                                       ->etc()
                         )
                 );
    }

    #[Test]
    public function it_denies_edit_access_to_non_owners()
    {
        $user = User::factory()->create();
        $anotherUser = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $anotherUser->id]);

        $response = $this->actingAs($user)->get(route('groups.edit', $group->id));

        $response->assertRedirect()->assertSessionHas('error', 'Unauthorized');
    }

    #[Test]
    public function it_updates_a_group_with_valid_data()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $user->id]);
        $topics = Topic::factory()->count(2)->create();

        $data = [
            'name' => 'Updated Group',
            'description' => 'Updated description',
            'location' => 'Updated Location',
            'topics' => $topics->pluck('id')->toArray(),
        ];

        $response = $this->actingAs($user)->put(route('groups.update', $group->id), $data);

        $response->assertRedirect(route('groups.show.details', $group->id))
                 ->assertSessionHas('success', 'Group updated successfully');

        $this->assertDatabaseHas('groups', [
            'id' => $group->id,
            'name' => 'Updated Group',
            'description' => 'Updated description',
            'location' => 'Updated Location',
        ]);

        $this->assertDatabaseHas('group_topic', [
            'group_id' => $group->id,
            'topic_id' => $topics->first()->id,
        ]);
    }

    #[Test]
    public function it_does_not_allow_non_owners_to_update_a_group()
    {
        $user = User::factory()->create();
        $anotherUser = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $anotherUser->id]);

        $response = $this->actingAs($user)->put(route('groups.update', $group->id), [
            'name' => 'Hacked Name',
            'description' => 'Hacked',
            'location' => 'Nowhere',
            'topics' => [],
        ]);

        $response->assertStatus(403);
    }

    #[Test]
    public function it_allows_a_group_owner_to_delete_the_group()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('groups.destroy', $group->id));

        $response->assertRedirect(route('Home'));

        $this->assertDatabaseMissing('groups', ['id' => $group->id]);
    }

    #[Test]
    public function it_prevents_non_owners_from_deleting_the_group()
    {
        $user = User::factory()->create();
        $anotherUser = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $anotherUser->id]);

        $response = $this->actingAs($user)->delete(route('groups.destroy', $group->id));

        $response->assertStatus(403);
        $this->assertDatabaseHas('groups', ['id' => $group->id]);
    }

    #[Test]
    public function it_updates_a_group_image()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $user->id]);

        $image = UploadedFile::fake()->image('group.jpg');

        $response = $this->actingAs($user)->post(route('groups.update.image', $group->id), [
            'image' => $image,
        ]);

        $response->assertStatus(200)->assertJson(['message' => 'Image uploaded successfully']);

        $group->refresh();

        Storage::disk('public')->assertExists($group->image_path);
    }

    #[Test]
    public function it_does_not_allow_non_owners_to_update_a_group_image()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $anotherUser = User::factory()->create();
        $group = Group::factory()->create(['user_id' => $anotherUser->id]);

        $image = UploadedFile::fake()->image('unauthorized.jpg');

        $response = $this->actingAs($user)->post(route('groups.update.image', $group->id), [
            'image' => $image,
        ]);

        $response->assertStatus(403);
        Storage::disk('public')->assertMissing('groups/unauthorized.jpg');
    }
}
