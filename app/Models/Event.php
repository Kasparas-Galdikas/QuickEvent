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

    // Automatically generate a slug when creating or updating an event
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            $event->slug = Str::slug($event->title); // Generate slug when creating
        });

        static::updating(function ($event) {
            $event->slug = Str::slug($event->title); // Update slug if the title changes
        });
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
