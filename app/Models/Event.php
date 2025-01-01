<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    // Allow mass assignment for the listed attributes
    protected $fillable = [
        'title',
        'event_date',
        'event_time',
        'duration',
        'description',
        'location',
        'image_path',
    ];

    // Define the many-to-many relationship with the Topic model
    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'event_topic');
    }
}
