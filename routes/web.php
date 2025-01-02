<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Group\GroupController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Topic;

// Home Route
Route::get('/', function () {
    return Inertia::render('Home');
});

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'sendResetLinkEmail'])->name('password.email');

    // Google OAuth
    Route::get('/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('google.redirect');
    Route::get('/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])->name('google.callback');

    // Verification Code Routes
    Route::get('/verify', function () {
        return Inertia::render('Auth/VerifyEmail');
    })->name('verify.page');

    Route::post('/verify', [RegisteredUserController::class, 'verify'])->name('verify.code');
    Route::post('/resend-verification-code', [RegisteredUserController::class, 'resend'])->name('verification.resend');
    Route::post('/check-user', [RegisteredUserController::class, 'checkUser'])->name('check.user');
});

// Public API Routes
Route::get('/topics', function () {
    return response()->json(Topic::select('id', 'name')->get());
});

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    // Events Routes
    Route::prefix('events')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Events/Events');
        })->name('events');

        Route::get('/details', function () {
            return Inertia::render('Events/EventDetails');
        })->name('events.details');

        Route::get('/create', function () {
            return Inertia::render('Events/CreateEvent');
        })->name('events.create');
    });

    // Groups Routes
    Route::prefix('groups')->group(function () {
        Route::get('/create', function () {
            return Inertia::render('Groups/CreateGroup');
        })->name('groups.create');

        Route::post('/', [GroupController::class, 'store'])->name('groups.store');

    });

    // Profile Routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware('verified')->name('dashboard');

    // Miscellaneous
    Route::get('/Profile', function () {
        return Inertia::render('Profile');
    })->name('Profile');
});

require __DIR__ . '/auth.php';
