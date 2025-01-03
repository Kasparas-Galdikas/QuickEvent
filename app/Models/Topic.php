<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // Relationships
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_topic');
    }

    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_topic', 'topic_id', 'event_id')
                    ->withTimestamps();
    }
    
}
