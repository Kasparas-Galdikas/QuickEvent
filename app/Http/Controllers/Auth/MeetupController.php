<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

class MeetupController extends Controller
{
    /**
     * Handle OAuth callback from Meetup.
     */
    public function handleCallback(Request $request)
    {
        // Check if the user denied access or if there is an error
        if ($request->has('error')) {
            return redirect('/')->with('error', 'Authorization failed: ' . $request->get('error_description', 'Unknown error'));
        }

        // Ensure the request contains the authorization code
        if (!$request->has('code')) {
            return redirect('/')->with('error', 'Authorization failed: Missing authorization code.');
        }

        // Exchange authorization code for an access token
        $response = Http::asForm()->post('https://secure.meetup.com/oauth2/access', [
            'client_id' => env('MEETUP_CLIENT_ID'),
            'client_secret' => env('MEETUP_CLIENT_SECRET'),
            'grant_type' => 'authorization_code',
            'redirect_uri' => env('MEETUP_REDIRECT_URI'), // Callback URL
            'code' => $request->get('code'),
        ]);

        // Check if the token request was successful
        if ($response->failed()) {
            return redirect('/')->with('error', 'Failed to retrieve access token.');
        }

        // Extract the access token from the response
        $accessToken = $response->json()['access_token'];

        // Store the token (session or database)
        session(['meetup_access_token' => $accessToken]);

        // Redirect to a success page or dashboard
        return redirect('/dashboard')->with('success', 'Meetup authorization successful!');
    }
}
