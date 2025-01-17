<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
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
    //PAKEISTI?
    public function getGroupEvents($groupId)
{
    $events = Event::where('group_id', $groupId)
        ->orderBy('event_date', 'asc')
        ->orderBy('event_time', 'asc')
        ->with(['topics', 'attendees'])
        ->get();

    return response()->json($events);
}

      /**
     * Register the authenticated user as an attendee for an event.
     */
    public function attend($eventId)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $event = Event::findOrFail($eventId);

        // Check if the user has already joined the event
        if ($event->attendees()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You are already attending this event'], 409);
        }

        // Register the user as an attendee
        $event->attendees()->attach($user->id, ['joined_at' => now()]);

        return response()->json(['message' => 'You are now attending this event'], 200);
    }


    private function fetchEventBySlug($slug)
    {
        return Event::with(['group.user', 'topics', 'attendees']) // Include attendees relationship
        ->where('slug', $slug)
        ->first();
    }
    
    public function show($slug)
    {
        $event = $this->fetchEventBySlug($slug);
    
        if (!$event) {
            abort(404, 'Event not found');
        }
    
        // Extract attendees' basic details
        $attendees = $event->attendees()->select('users.id', 'users.name', 'users.email')->get();
    
        return Inertia::render('Events/EventDetails', [
            'event' => $event, // Event details
            'host' => $event->group->user->name ?? 'Unknown Host', // Host name
            'topics' => $event->topics, // Topics related to the event
            'group' => $event->group, // Group details, including user_id
            'attendees' => $attendees, // Pass attendees to the front-end
        ]);
    }
    
    public function destroy($id)
{
    $event = Event::findOrFail($id);
    
    // Check if user has permission to delete
    if (auth()->id() !== $event->group->user_id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $event->delete();
    return response()->json(['message' => 'Event deleted successfully']);
}
    
public function edit($id)
{
    $event = Event::with(['topics', 'group'])->findOrFail($id);
    
    // Check if user has permission to edit
    if (auth()->id() !== $event->group->user_id) {
        return redirect()->back()->with('error', 'Unauthorized');
    }

    return Inertia::render('Events/EditEvent', [
        'event' => $event,
        'topics' => $event->topics,
        'group' => $event->group
    ]);
}
public function update(Request $request, $id)
{
    $event = Event::findOrFail($id);
    
    // Check if user has permission to update
    if (auth()->id() !== $event->group->user_id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Validate the request
    $validated = $request->validate([
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
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('events', 'public');
        // Pridėkite pilną kelią
        $imagePath = '/storage/' . $imagePath;
        $event->image_path = $imagePath;
    }

    // Update event
    $event->update([
        'title' => $validated['title'],
        'description' => $validated['description'],
        'event_date' => date('Y-m-d', strtotime($validated['start_date'])),
        'event_time' => date('H:i:s', strtotime($validated['start_date'])),
        'duration' => $validated['duration'],
        'location' => $validated['location'],
    ]);

    // Update topics
    if (isset($validated['topics'])) {
        $event->topics()->sync($validated['topics']);
    }

    return response()->json(['message' => 'Event updated successfully', 'event' => $event]);
}
}

