<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'title',
        'event_date',
        'event_time',
        'duration',
        'location',
        'image_path',
        'description',
        'slug', // Include slug in fillable properties
    ];

    // Automatically generate a unique slug when creating or updating an event
    protected static function boot()
    {
        parent::boot();

        // Generate unique slug when creating an event
        static::creating(function ($event) {
            $event->slug = static::generateUniqueSlug($event->title);
        });

        // Update slug when the title changes during updates
        static::updating(function ($event) {
            if ($event->isDirty('title')) {
                $event->slug = static::generateUniqueSlug($event->title, $event->id);
            }
        });
    }

    /**
     * Generate a unique slug for the event.
     *
     * @param string $title
     * @param int|null $eventId
     * @return string
     */
    private static function generateUniqueSlug($title, $eventId = null)
    {
        $slug = Str::slug($title); // Generate slug from the title
        $originalSlug = $slug; // Store the original slug
        $count = 1;

        // Check for conflicts with existing slugs
        while (static::where('slug', $slug)->when($eventId, function ($query) use ($eventId) {
            $query->where('id', '!=', $eventId); // Exclude the current event ID during updates
        })->exists()) {
            $slug = $originalSlug . '-' . $count++; // Append a number to make the slug unique
        }

        return $slug;
    }

    // Define the group relationship
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // Define the topics relationship
    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'event_topic', 'event_id', 'topic_id')
                    ->withTimestamps();
    }
}
