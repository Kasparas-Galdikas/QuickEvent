<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

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

        // Fetch the first page of events (paginated)
        $events = Event::orderBy('event_date', 'asc')->paginate(10);

        // Return the Inertia page with all required data
        return Inertia::render('Home', [
            'auth'   => [
                'user' => $user,
            ],
            'groups' => $groups,
            'events' => $events->items(), // Pass only the current page's events
            'pagination' => [
                'current_page' => $events->currentPage(),
                'last_page'    => $events->lastPage(),
                'per_page'     => $events->perPage(),
            ],
        ]);
    }

    /**
     * Fetch more events for infinite scroll.
     */
    public function fetchEvents(Request $request)
    {
        $events = Event::orderBy('event_date', 'asc')->paginate(10);
    
        return response()->json([
            'events' => $events->items(),
            'pagination' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
            ],
        ]);
    }
    
}

