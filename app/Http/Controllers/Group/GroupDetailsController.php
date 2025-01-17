<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\Topic;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
            'user_id' => $group->user_id,
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

    public function edit($id)
    {
        $group = Group::with(['topics'])->findOrFail($id);
        
        // Check if user has permission to edit
        if (auth()->id() !== $group->user_id) {
            return redirect()->back()->with('error', 'Unauthorized');
        }

        return Inertia::render('Groups/EditGroup', [
            'group' => $group,
        ]);
    }

    public function update(Request $request, $id)
{
    $group = Group::findOrFail($id);
    
    // Check if user has permission to update
    if (auth()->id() !== $group->user_id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Validate the request
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'location' => 'required|string|max:255',
        'topics' => 'required|array|min:1', // Add validation for topics
        'topics.*' => 'exists:topics,id'
    ]);

    // Update group basic info
    $group->update([
        'name' => $validated['name'],
        'description' => $validated['description'],
        'location' => $validated['location'],
    ]);

    // Sync topics
    $group->topics()->sync($request->topics);

    return redirect()->route('groups.show.details', $group->id)
        ->with('success', 'Group updated successfully');
}
   //destroy method
   public function destroy($id)
{
    $group = Group::findOrFail($id);
    
    if (auth()->id() !== $group->user_id) {
        abort(403);
    }

    if ($group->image_path) {
        Storage::delete($group->image_path);
    }

    // Delete the group (events will be automatically deleted due to the boot method)
    $group->delete();

    return to_route('Home');
}
}