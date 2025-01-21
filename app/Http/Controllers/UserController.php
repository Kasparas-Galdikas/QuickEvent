<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class UserController extends Controller
{
    /**
     * Check and fetch user location.
     */
    public function checkLocation()
    {
        $user = Auth::user();

        // If the user's location is already set, return it.
        if (!empty($user->location)) {
            return response()->json(['location' => $user->location]);
        }

        // Otherwise, try to fetch location using the geocoding API.
        try {
            $response = Http::get('https://ip-api.com/json');

            if ($response->failed()) {
                return response()->json(['error' => 'Failed to fetch location from API'], 500);
            }

            $data = $response->json();

            if (!isset($data['city']) || !isset($data['countryCode'])) {
                return response()->json(['error' => 'Incomplete location data from API'], 400);
            }

            // Combine city and country code to create a location string.
            $detectedLocation = "{$data['city']}, {$data['countryCode']}";

            // Update the user's location if it was empty.
            $this->updateLocation(new Request(['location' => $detectedLocation]));

            return response()->json(['location' => $detectedLocation]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching location data'], 500);
        }
    }

    /**
     * Update user location.
     */
    public function updateLocation(Request $request)
    {
        $request->validate([
            'location' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $user->location = $request->input('location');
        $user->save();

        return response()->json(['message' => 'Location updated successfully.']);
    }
}
