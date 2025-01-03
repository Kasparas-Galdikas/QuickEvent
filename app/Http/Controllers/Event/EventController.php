<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;
use Illuminate\Support\Facades\Log; 
class EventController extends Controller
{
    /**
     * Fetch topics related to a specific group.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
   public function fetchTopics(Request $request)
    {
        try {
            // Validate that the group_id parameter is provided
            $request->validate([
                'group_id' => 'required|integer|exists:groups,id',
            ]);

            // Fetch the group and its related topics
            $group = Group::with('topics')->findOrFail($request->input('group_id'));

            // Return the related topics
            return response()->json($group->topics);

        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error fetching topics:', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'Failed to fetch topics'], 500);
        }
    }

}
