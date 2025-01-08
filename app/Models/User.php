<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id', 
        'verification_code',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the groups created by the user.
     */
    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    /**
     * Define a many-to-many relationship with Event for attending events.
     */
    public function events()
    {
        return $this->belongsToMany(Event::class)->withPivot('joined_at', 'left_at')->withTimestamps();
    }

    /**
     * Join an event.
     */
    public function joinEvent(Event $event)
    {
        $this->events()->attach($event->id, ['joined_at' => now(), 'left_at' => null]);
    }

    /**
     * Leave an event.
     */
    public function leaveEvent(Event $event)
    {
        $this->events()->updateExistingPivot($event->id, ['left_at' => now()]);
    }
}
