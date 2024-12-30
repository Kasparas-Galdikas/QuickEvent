<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        // Authenticate the user
        $request->authenticate();
    
        // Check if the user's email is verified
        $user = Auth::user(); // Get the authenticated user
    
        if (is_null($user->email_verified_at)) {
            // Log the user out immediately if not verified
            Auth::logout();
    
            // Return a JSON response indicating unverified status
            return response()->json([
                'status' => 'unverified',
                'email' => $user->email,
                'message' => 'Your email address is not verified. Please check your email to verify your account.',
            ], 200); // 200 OK to avoid triggering catch blocks unnecessarily
        }
    
        // Regenerate session if email is verified
        $request->session()->regenerate();
    
        // Return success response
        return response()->json(['status' => 'verified']);
    }
    



    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken(); // Regenerate the CSRF token

        return redirect('/');
    }
}
