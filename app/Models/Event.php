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
        'type',
        'category',
        'event_time',
        'duration',
        'location',
        'image_path',
        'description',
        'slug',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            $event->slug = static::generateUniqueSlug($event->title);
        });

        static::updating(function ($event) {
            if ($event->isDirty('title')) {
                $event->slug = static::generateUniqueSlug($event->title, $event->id);
            }
        });
    }

    private static function generateUniqueSlug($title, $eventId = null)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->when($eventId, function ($query) use ($eventId) {
            $query->where('id', '!=', $eventId);
        })->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }

    /**
     * Define the group relationship.
     */
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Define the topics relationship.
     */
    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'event_topic', 'event_id', 'topic_id')
                    ->withTimestamps();
    }

    /**
     * Define a many-to-many relationship with User for event attendees.
     */
    public function attendees()
    {
        return $this->belongsToMany(User::class, 'event_user', 'event_id', 'user_id')
                    ->withPivot('joined_at', 'left_at') // Include pivot data
                    ->whereNull('event_user.left_at');  // Only include active attendees
    }
    
}
