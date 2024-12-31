<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\GoogleAuthController;

Route::get('/', function () {
    return Inertia::render('Home');
});

// Auth Routes
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');

// Google OAuth Routes
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])->name('google.callback');

// Verification Code Route
Route::get('/verify', function () {
    return Inertia::render('Auth/VerifyEmail');
})->name('verify.page');

Route::post('/verify', [RegisteredUserController::class, 'verify'])->name('verify.code');
Route::post('/resend-verification-code', [RegisteredUserController::class, 'resend'])->name('verification.resend');
Route::post('/check-user', [RegisteredUserController::class, 'checkUser'])->name('check.user');

Route::middleware(['auth'])->group(function () {
    // Events Routes
    Route::get('/events', function () {
        return Inertia::render('Events/Events');
    })->name('events');

    Route::get('/events/details', function () {
        return Inertia::render('Events/EventDetails');
    })->name('events.details');
    
    Route::get('/events/create', function () {
        return Inertia::render('Events/CreateEvent');
    })->name('events.create');

    // Profile Routes
    Route::get('/Profile', function () {
        return Inertia::render('Profile');
    })->name('Profile');

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware('verified')->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Groups Routes
    Route::get('/groups/create', function () {
        return Inertia::render('Groups/CreateGroup');
    })->name('groups.create');
});

require __DIR__ . '/auth.php';