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
    public function index()
    {
        $user = Auth::user();
    
        // Fetch groups related to the authenticated user without members count
        $groups = Group::where('user_id', $user->id)
            ->get()
            ->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'image_path' => $group->image_path, // Ensure this field exists
                    // Remove 'member_count' as we are not using members
                ];
            });
    
            return Inertia::render('Events/Events', [ // Match the component file name
                'groups' => $groups,
                'auth' => [
                    'user' => $user->only(['id', 'name']),
                ],
            ]);
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
