<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GroupController extends Controller
{
    // Add this new index method
    public function index()
    {
        $groups = Group::with(['user', 'topics'])->get();
        
        return Inertia::render('Groups/Index', [
            'groups' => $groups
        ]);
    }
    public function show($id)
    {
        // Fetch the group using the provided ID
        $group = Group::find($id);

        // Check if the group exists
        if (!$group) {
            Log::warning('Group not found', ['id' => $id]);
            return response()->json(['error' => 'Group not found'], 404);
        }

        // Return the group data as JSON
        return response()->json($group);
    }

    /**
     * Store a newly created group in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'groupName' => 'required|string|max:255',
                'groupDescription' => 'required|string|min:50',
                'location' => 'required|string|max:255',
                'topics' => 'required|array',
                'topics.*' => 'exists:topics,id', // Ensure topic IDs exist
            ]);

            // Create the group
            $group = Group::create([
                'name' => $validated['groupName'],
                'description' => $validated['groupDescription'],
                'location' => $validated['location'],
                'user_id' => auth()->id(),
            ]);

            // Attach topics to the group
            $group->topics()->attach($validated['topics']);

            return response()->json([
                'message' => 'Group created successfully!',
                'group' => $group,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create group'], 500);
        }
    }

    /**
     * Set the group_id in the session and redirect to the events.create page.
     */
    public function setGroupId(Request $request, $id)
    {
        // Store the group_id in the session
        $request->session()->put('group_id', $id);
    
        // Redirect to the clean URL
        return redirect()->route('events.create');
    }
    
 
}
