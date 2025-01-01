<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;

    // Allow mass assignment for the name attribute
    protected $fillable = ['name'];

    // Define the many-to-many relationship with the Event model
    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_topic');
    }
}
