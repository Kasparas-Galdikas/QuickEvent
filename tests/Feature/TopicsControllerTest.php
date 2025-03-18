<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Topic;
use App\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TopicsControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test fetching all topics.
     */
    public function test_fetch_all_topics()
    {
        // Create 3 topics in the database
        Topic::factory()->count(3)->create();

        // Send GET request to fetch topics
        $response = $this->getJson(route('topics.index'));

        // Verify response is successful and contains 3 topics
        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }

    /**
     * Test fetching topics filtered by group ID.
     */
    public function test_fetch_topics_by_group_id()
    {
        // Create a group
        $group = Group::factory()->create();

        // Create two topics
        $topics = Topic::factory()->count(2)->create();

        // Attach topics to the group via the pivot table (group_topic)
        $group->topics()->attach($topics);

        // Send request to filter topics by the group's ID
        $response = $this->getJson(route('topics.filter.by.group', ['group_id' => $group->id]));

        // Verify response is successful and contains 2 topics
        $response->assertStatus(200);
        $response->assertJsonCount(2);
    }

    /**
     * Test filtering topics by an invalid or non-existent group ID.
     */
    public function test_filter_topics_fails_with_invalid_group_id()
    {
        // Send request with an invalid group ID
        $response = $this->getJson(route('topics.filter.by.group', ['group_id' => 999]));

        // Verify the request fails with validation error
        $response->assertStatus(422);
    }

    /**
     * Test filtering topics when no group_id is provided.
     */
    public function test_filter_topics_fails_when_group_id_is_missing()
    {
        // Send request without group_id
        $response = $this->getJson(route('topics.filter.by.group'));

        // Verify the request fails with validation error
        $response->assertStatus(422);
    }
}
