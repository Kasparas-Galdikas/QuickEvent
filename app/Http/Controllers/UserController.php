<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
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

    public function checkLocation()
    {
        $user = Auth::user();
        return response()->json(['location' => $user->location]);
    }
}

