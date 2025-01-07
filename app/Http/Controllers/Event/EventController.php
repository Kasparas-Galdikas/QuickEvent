<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
class EventController extends Controller
{


    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'group_id' => 'required|exists:groups,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'start_date' => 'required|date',
            'duration' => 'required|integer|min:1|max:24',
            'location' => 'required|string|max:255',
            'topics' => 'nullable|array',
            'topics.*' => 'exists:topics,id',
            'image' => 'nullable|image|max:2048',
        ]);

        // Handle image upload if provided
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        // Create the event
        $event = Event::create([
            'group_id' => $validated['group_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'event_date' => date('Y-m-d', strtotime($validated['start_date'])),
            'event_time' => date('H:i:s', strtotime($validated['start_date'])),
            'duration' => $validated['duration'],
            'location' => $validated['location'],
            'image_path' => $imagePath,
        ]);

        // Attach topics if provided
        if (!empty($validated['topics'])) {
            $event->topics()->attach($validated['topics']);
        }

        // Redirect to the events page with a success message
        return redirect()->route('Home')->with('success', 'Event created successfully!');
    }

    private function fetchEventBySlug($slug)
    {
        return Event::with(['group.user', 'topics']) // Include topics relationship
        ->where('slug', $slug)
        ->first();
    }
    
    public function show($slug)
    {
        $event = $this->fetchEventBySlug($slug);
    
        if (!$event) {
            abort(404, 'Event not found');
        }
    
        return Inertia::render('Events/EventDetails', [
            'event' => $event, // Event details
            'host' => $event->group->user->name ?? 'Unknown Host', // Host name
            'topics' => $event->topics, // Topics related to the event
            'group' => $event->group, // Group details, including user_id
        ]);
        
    }
    
    
}
