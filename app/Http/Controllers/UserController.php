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
    public function checkLocation(Request $request)
    {
        try {
            $latitude = $request->query('lat');
            $longitude = $request->query('lon');

            if ($latitude && $longitude) {
                // Use OpenStreetMap API with a proper User-Agent
                $response = Http::withHeaders([
                    'User-Agent' => 'LaravelApp/1.0 (your@email.com)' // Replace with your email
                ])->get("https://nominatim.openstreetmap.org/reverse?format=json&lat={$latitude}&lon={$longitude}");

                if ($response->failed()) {
                    return response()->json(['error' => 'Failed to fetch precise location'], 500);
                }

                $data = $response->json();

                // Handle different possible location fields
                $city = $data['address']['city'] ??
                    $data['address']['town'] ??
                    $data['address']['village'] ??
                    $data['address']['municipality'] ??
                    $data['address']['county'] ??
                    null;

                $countryCode = $data['address']['country_code'] ?? null;

                if (!$city || !$countryCode) {
                    return response()->json(['error' => 'Incomplete geolocation data'], 400);
                }

                $detectedLocation = "{$city}, " . strtoupper($countryCode);
            } else {
                // Fallback to IP-based location
                $response = Http::get('https://ipwho.is/');

                if ($response->failed()) {
                    return response()->json(['error' => 'Failed to fetch location from API'], 500);
                }

                $data = $response->json();

                if (!isset($data['city']) || !isset($data['country_code'])) {
                    return response()->json(['error' => 'Incomplete location data from API'], 400);
                }

                $detectedLocation = "{$data['city']}, {$data['country_code']}";
            }

            // Check if user is logged in before updating the database
            $user = Auth::user();
            if ($user) {
                if (empty($user->location) || $user->location !== $detectedLocation) {
                    $this->updateLocation(new Request(['location' => $detectedLocation]));
                }
            }

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

    /**
     * Get stored user location from the database.
     */
    public function getUserLocation()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json(['location' => $user->location ?? '']);
    }

}
