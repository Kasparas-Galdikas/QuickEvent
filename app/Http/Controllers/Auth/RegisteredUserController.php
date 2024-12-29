<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\VerificationMail;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Generate a unique 6-digit verification code
        $verificationCode = random_int(100000, 999999);

        // Create the user with the verification code
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'verification_code' => $verificationCode,
        ]);

        // Trigger the registration event
        event(new Registered($user));

        // Send verification email
        Mail::to($user->email)->send(new VerificationMail($verificationCode));

        // Redirect to a page for entering the verification code
        return redirect(route('verify.page'))->with('status', 'Verification email sent! Please check your inbox.');
    }

    /**
     * Verify the email using the verification code.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'verification_code' => 'required|digits:6',
        ]);
    
        $user = User::where('email', $request->email)
                    ->where('verification_code', $request->verification_code)
                    ->first();
    
        if (!$user) {
            return response()->json([
                'errors' => ['verification_code' => 'The verification code is incorrect.']
            ], 422);
        }
    
        // Mark user as verified
        $user->email_verified_at = now();
        $user->verification_code = null; // Clear the code
        $user->save();
    
        // Log in the user
        Auth::login($user);
    
        return response()->json(['message' => 'Email verified successfully.'], 200);
    }

    /**
     * Check if the user exists and requires verification.
     */
    public function checkUser(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if ($user && is_null($user->email_verified_at)) {
            return response()->json(['requiresVerification' => true], 200);
        }

        return response()->json(['requiresVerification' => false], 200);
    }

    /**
     * Resend the verification code.
     */
    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email is already verified.'], 400);
        }

        // Generate a new verification code
        $verificationCode = random_int(100000, 999999);
        $user->update(['verification_code' => $verificationCode]);

        // Send the new verification email
        Mail::to($user->email)->send(new VerificationMail($verificationCode));

        return response()->json(['message' => 'A new verification code has been sent.'], 200);
    }
}
