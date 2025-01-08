<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OAuthController extends Controller
{
    public function handleCallback(Request $request)
    {
        $code = $request->query('code');

        // Check if the authorization code exists
        if (!$code) {
            return response()->json(['error' => 'Authorization code not provided'], 400);
        }

        // Exchange the authorization code for an access token
        $response = Http::asForm()->post('https://secure.meetup.com/oauth2/access', [
            'client_id' => env('MEETUP_CLIENT_ID'),
            'client_secret' => env('MEETUP_CLIENT_SECRET'),
            'grant_type' => 'authorization_code',
            'redirect_uri' => env('MEETUP_REDIRECT_URI'),
            'code' => $code,
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to obtain access token'], 500);
        }

        $accessToken = $response->json()['access_token'];

        // Store the access token securely (e.g., in the database or session)
        // ...

        return response()->json(['message' => 'OAuth flow completed successfully', 'access_token' => $accessToken]);
    }
}
