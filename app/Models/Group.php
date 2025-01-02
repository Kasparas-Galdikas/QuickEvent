<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'location', 'user_id'];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'group_topic', 'group_id', 'topic_id');
    }
}
