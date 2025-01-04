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
    public function show($id)
    {
        // Log the incoming request for debugging
        Log::info('Fetching group details', ['id' => $id]);
    
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
            Log::info('GroupController@store called', ['user_id' => auth()->id()]);

            // Validate the request
            $validated = $request->validate([
                'groupName' => 'required|string|max:255',
                'groupDescription' => 'required|string|min:50',
                'location' => 'required|string|max:255',
                'topics' => 'required|array',
                'topics.*' => 'exists:topics,id', // Ensure topic IDs exist
            ]);

            Log::info('Validation successful', ['validated_data' => $validated]);

            // Create the group
            $group = Group::create([
                'name' => $validated['groupName'],
                'description' => $validated['groupDescription'],
                'location' => $validated['location'],
                'user_id' => auth()->id(),
            ]);

            Log::info('Group created successfully', ['group_id' => $group->id]);

            // Attach topics to the group
            $group->topics()->attach($validated['topics']);
            Log::info('Topics attached to group', [
                'group_id' => $group->id,
                'topics' => $validated['topics'],
            ]);

            return response()->json([
                'message' => 'Group created successfully!',
                'group' => $group,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in GroupController@store', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Failed to create group'], 500);
        }
    }
}
