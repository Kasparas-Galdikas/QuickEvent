<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Event\EventController;
use App\Http\Controllers\Event\HomePageController;
use App\Http\Controllers\Group\GroupController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TopicsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\OAuthController;
use App\Http\Controllers\Group\GroupDetailsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Profile Routes
Route::get('/Profile', fn() => Inertia::render('Profile'))->name('profile');

// Public Routes
Route::get('/', function () {
    return Inertia::render('LandingPage');
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

// Verification Code Routes
Route::get('/verify', function () {
    return Inertia::render('Auth/VerifyEmail');
})->name('verify.page');
Route::post('/verify', [RegisteredUserController::class, 'verify'])->name('verify.code');
Route::post('/resend-verification-code', [RegisteredUserController::class, 'resend'])->name('verification.resend');
Route::post('/check-user', [RegisteredUserController::class, 'checkUser'])->name('check.user');


// Topics Routes
Route::prefix('topics')->group(function () {
    Route::get('/', [TopicsController::class, 'index'])->name('topics.index');
    Route::get('/filter-by-group', [TopicsController::class, 'filterByGroup'])->name('topics.filter-by-group');
});

//  unauthenticated routes for all users 
Route::get('/events/details/{slug}', [EventController::class, 'show'])->name('events.details');
Route::get('/api/events', [HomePageController::class, 'fetchEvents'])->name('api.events');


// Authenticated Routes
Route::middleware(['auth'])->group(function () {

    // Home Routes
    Route::prefix('Home')->group(function () {
        Route::get('/', [HomePageController::class, 'showHomePage'])->name('Home');

    });

    // Events Routes

    Route::post('/events/{id}/attend', [EventController::class, 'attend'])->name('events.attend');

    Route::prefix('events')->group(function () {

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

    Route::prefix('groups')->group(function () {
        // ... kiti maršrutai
        Route::get('/show/{id}', [GroupDetailsController::class, 'show'])
            ->name('groups.show')
            ->where('id', '[0-9]+'); // užtikrina, kad id būtų skaičius
    });
    
    // Profile Routes
    Route::prefix('profile')->group(function () {

        // These routes handle the edit, update, and delete functionalities
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

});

// Default Laravel auth routes
require __DIR__ . '/auth.php';
