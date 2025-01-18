<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');
        $location = $request->input('location'); // Get location input
        $perPage = $request->input('perPage', 10); // Default to 10 results per page
    
        if (!$query && !$location) {
            return response()->json(['error' => 'Search query or location is required'], 400);
        }
    
        // Start building the query
        $events = Event::query();
    
        // Filter by query if provided
        if ($query) {
            $events->where('title', 'like', '%' . $query . '%');
        }
    
        // Filter by location if provided
        if ($location) {
            $events->where('location', 'like', '%' . $location . '%');
        }
    
        // Paginate the results
        $results = $events->paginate($perPage);
    
        return response()->json($results);
    }
    
}
