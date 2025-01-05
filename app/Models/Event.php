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
    ];

    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'event_topic', 'event_id', 'topic_id')
                    ->withTimestamps();
    }
}
