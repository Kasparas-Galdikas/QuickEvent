<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group_id' => Group::factory(),  // Automatically creates a new Group when generating an Event
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'event_date' => $this->faker->date,
            'event_time' => $this->faker->time,
            'duration' => $this->faker->numberBetween(1, 24),
            'location' => $this->faker->address,
            'type' => $this->faker->randomElement(['in-person', 'online']),
            'image_path' => null,
        ];
    }
}
