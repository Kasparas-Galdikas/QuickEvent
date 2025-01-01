<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'event_date',
        'event_time',
        'duration',
        'description',
        'location',
        'image_path',
        'group_id',
    ];

    // Relationships
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'event_topic');
    }
}
