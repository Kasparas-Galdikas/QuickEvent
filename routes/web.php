<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Event\EventController;
use App\Http\Controllers\Event\EventsPageController;
use App\Http\Controllers\Group\GroupController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TopicsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Profile Routes
Route::get('/Profile', fn() => Inertia::render('Profile'))->name('profile');

// Public Routes
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
    Route::get('/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('google.redirect');
    Route::get('/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])->name('google.callback');
});

// Topics Routes
Route::prefix('topics')->group(function () {
    Route::get('/', [TopicsController::class, 'index'])->name('topics.index');
    Route::get('/filter-by-group', [TopicsController::class, 'filterByGroup'])->name('topics.filter-by-group');
});

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    
    // Events Routes
    Route::prefix('events')->group(function () {
        
        Route::get('/', [EventsPageController::class, 'showEventsPage'])->name('events.index');
        
        Route::get('/details/{name}', fn($name) => Inertia::render('Events/EventDetails', ['eventName' => $name]))
        ->name('events.details');
    

        // Updated CreateEvent route to use session-based group_id
        Route::get('/groups/set-group/{id}', [GroupController::class, 'setGroupId'])->name('groups.setGroupId');

        Route::get('/events/create', function () {
            $group_id = session('group_id'); // Fetch group_id from the session
            return Inertia::render('Events/CreateEvent', [
                'group_id' => $group_id, // Pass group_id to Inertia
            ]);
        })->name('events.create');
        

        Route::post('/', [EventController::class, 'store'])->name('events.store');
    });

    // Group Routes
    Route::prefix('groups')->group(function () {
        Route::get('/', [GroupController::class, 'index'])->name('groups.index');
        Route::get('/create', fn() => Inertia::render('Groups/CreateGroup'))->name('groups.create');
        Route::get('/{id}', [GroupController::class, 'show'])->name('groups.show');
        Route::post('/', [GroupController::class, 'store'])->name('groups.store');

        // New route to set group_id in the session
        Route::get('/set-group/{id}', [GroupController::class, 'setGroupId'])->name('groups.setGroupId');
    });

    // Profile Routes
    Route::prefix('profile')->group(function () {
       
        // These routes handle the edit, update, and delete functionalities
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
    

    // Dashboard
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->middleware('verified')->name('dashboard');
});

// Default Laravel auth routes
require __DIR__ . '/auth.php';
