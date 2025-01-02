<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\Topic;

class GroupController extends Controller
{
    /**
     * Store a newly created group in storage.
     */
    public function store(Request $request)
    {
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
            'user_id' => auth()->id(), // Assuming the user is logged in
        ]);

        // Attach topics to the group
        $group->topics()->attach($validated['topics']);

        return response()->json([
            'message' => 'Group created successfully!',
            'group' => $group,
        ]);
    }
}
