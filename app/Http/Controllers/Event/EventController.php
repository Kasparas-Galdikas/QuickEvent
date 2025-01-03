<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate incoming request
        $validated = $request->validate([
            'group_id'   => 'required|exists:groups,id',
            'title'      => 'required|string|max:255',
            'description'=> 'required|string|max:1000',  // <-- Add description here
            'start_date' => 'required|date',
            'duration'   => 'required|integer|min:1|max:24', // Must be an integer, e.g., 1, 2, 3...
            'location'   => 'required|string|max:255',
            'topics'     => 'nullable|array',
            'topics.*'   => 'exists:topics,id',
            'image'      => 'nullable|image|max:2048',
        ]);

        // 2. Handle image upload if present
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        // 3. Create the Event
        $event = Event::create([
            'group_id'    => $validated['group_id'],
            'title'       => $validated['title'],
            'description' => $validated['description'],       // Use the validated description
            'event_date'  => date('Y-m-d', strtotime($validated['start_date'])),
            'event_time'  => date('H:i:s', strtotime($validated['start_date'])),
            'duration'    => $validated['duration'],          // Use the validated duration
            'location'    => $validated['location'],
            'image_path'  => $imagePath,
            // 'user_id'   => Auth::id(), if you have a user_id field in your events table
        ]);

        // 4. Attach Topics (in event_topic pivot)
        if (!empty($validated['topics'])) {
            $event->topics()->attach($validated['topics']);
        }

        // 5. Redirect or respond
        return redirect()->route('events.index')->with('success', 'Event created successfully!');
    }
}
