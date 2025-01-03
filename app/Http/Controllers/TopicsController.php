<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TopicsController extends Controller
{
    /**
     * Fetch all topics.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Fetch all topics
            $topics = Topic::all();

          

            return response()->json($topics);
        } catch (\Exception $e) {
            Log::error('Error fetching all topics.', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch topics'], 500);
        }
    }

    /**
     * Fetch topics by group ID (optional).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function filterByGroup(Request $request)
    {
        try {
            // Validate the 'group_id' parameter
            $request->validate([
                'group_id' => 'required|integer|exists:groups,id',
            ]);
    
            $groupId = $request->input('group_id');
    
            // Fetch topics related to the group via the group_topic table
            $topics = Topic::whereIn('id', function ($query) use ($groupId) {
                $query->select('topic_id')
                    ->from('group_topic')
                    ->where('group_id', $groupId);
            })->get();
    
           
    
            return response()->json($topics);
        } catch (\Exception $e) {
            Log::error('Error fetching topics by group.', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch topics by group'], 500);
        }
    }
    
}
