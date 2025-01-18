<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
class MeetingController extends Controller
{
    public function show(string $slug)
    {
        $user = Auth::user();
        $redirectUrl = route('events.details', ['slug' => $slug]);

        // Log the generated redirection URL
        Log::info('Generated redirect URL:', ['redirectUrl' => $redirectUrl]);

        return Inertia::render('Meetings/MeetingRoom', [
            'roomSlug' => $slug,
            'userName' => $user->name,
        ]);
    }
}
