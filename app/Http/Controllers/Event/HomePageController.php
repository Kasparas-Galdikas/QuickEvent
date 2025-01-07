<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomePageController extends Controller
{
    /**
     * Display the dedicated events page.
     */
    public function showHomePage()
    {
        $user = Auth::user();

        // Fetch groups the user organizes and eager-load their events
        $groups = $user->groups()->with('events')->get();

        // Fetch all events from the database
        $events = Event::orderBy('event_date', 'asc')->get();

        // Return the Inertia page with all required data
        return Inertia::render('Home', [
            'auth'   => [
                'user' => $user,
            ],
            'groups' => $groups,
            'events' => $events,
        ]);
    }
}
