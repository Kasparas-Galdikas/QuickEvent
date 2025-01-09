<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\Topic;
use Inertia\Inertia;

class GroupDetailsController extends Controller
{
    public function index()
    {
        $groups = Group::with(['user', 'topics'])->get();
        return Inertia::render('Groups/Index', [
            'groups' => $groups
        ]);
    }

    public function create()
    {
        return Inertia::render('Groups/CreateGroup');
    }

    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'groupName' => 'required|string|max:255',
            'groupDescription' => 'required|string|min:50',
            'location' => 'required|string|max:255',
            'topics' => 'required|array',
            'topics.*' => 'exists:topics,id',
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
    }

    public function show(Request $request)
    {
        $group = Group::findOrFail($request->id);
        
        // Load essential relationships
        $group->load(['user', 'topics', 'events']);

        // Prepare the group data for the frontend
        $groupData = [
            'id' => $group->id,
            'name' => $group->name,
            'description' => $group->description,
            'location' => $group->location,
            'image_path' => null,
            'user' => [
                'id' => $group->user->id,
                'name' => $group->user->name
            ],
            'topics' => $group->topics,
            'events' => $group->events,
            'created_at' => $group->created_at,
            'updated_at' => $group->updated_at
        ];

        return Inertia::render('Groups/Show', [
            'group' => $groupData
        ]);
    }

    public function setGroupId(Request $request, $id)
    {
        session(['group_id' => $id]);
        return redirect()->route('events.create');
    }
}