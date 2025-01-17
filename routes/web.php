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
use App\Http\Controllers\Group\GroupDetailsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Profile Routes
Route::get('/Profile', fn() => Inertia::render('Profile'))->name('profile');

// Public Routes unauthenticated
Route::get('/', function () {
    return Inertia::render('LandingPage');
});
// Upcomming event route 
Route::get('/events/upcoming', [EventController::class, 'getUpcomingEvents']);


// Attendance Routes
Route::post('/events/{id}/attend', [EventController::class, 'attend'])->name('events.attend');
Route::delete('/events/{id}/attend', [EventController::class, 'unattend'])->name('events.unattend');
Route::get('/events/{id}/is-attending', [EventController::class, 'isAttending'])->name('events.isAttending');
Route::get('/user-attended-events', [EventController::class, 'getUserAttendedEvents'])->name('user.attended.events');
Route::get('/events/{id}/attendees', [EventController::class, 'getEventAttendees']);


//Event Path route 
Route::get('/events/details/{slug}', [EventController::class, 'show'])->name('events.details');

//Home routes to fetch events for infinite scroll and calendar
Route::get('/api/events', [HomePageController::class, 'fetchEvents'])->name('api.events');
Route::get('/api/calendar-events', [HomePageController::class, 'fetchEventsForCalendar']);


// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login.form');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout.action');
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register.form');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'sendResetLinkEmail'])->name('password.email.custom');
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
    Route::get('/filter-by-group', [TopicsController::class, 'filterByGroup'])->name('topics.filter.by.group');
});

// Authenticated Routes
Route::middleware(['auth'])->group(function () {

    // Home Routes
    Route::prefix('Home')->group(function () {
        Route::get('/', [HomePageController::class, 'showHomePage'])->name('Home');
    });

    Route::prefix('events')->group(function () {
        Route::get('/groups/set-group/{id}', [GroupController::class, 'setGroupId'])->name('groups.setGroupId');

        Route::get('/events/create', function () {
            $group_id = session('group_id');
            return Inertia::render('Events/CreateEvent', [
                'group_id' => $group_id,
            ]);
        })->name('events.create');

        Route::post('/', [EventController::class, 'store'])->name('events.store');
        Route::delete('/{id}', [EventController::class, 'destroy'])->name('events.destroy');
        Route::get('/edit/{id}', [EventController::class, 'edit'])->name('events.edit');
        Route::put('/{id}', [EventController::class, 'update'])->name('events.update');  // Pridėtas naujas maršrutas
    });

    // Group Routes
    Route::prefix('groups')->group(function () {
        Route::get('/', [GroupController::class, 'index'])->name('groups.index');
        Route::get('/create', fn() => Inertia::render('Groups/CreateGroup'))->name('groups.create');
        Route::post('/', [GroupController::class, 'store'])->name('groups.store');
        Route::get('/set-group/{id}', [GroupController::class, 'setGroupId'])->name('groups.setGroupId');
        Route::get('/show/{id}', [GroupDetailsController::class, 'show'])->name('groups.show.details')->where('id', '[0-9]+');
        Route::get('/{groupId}/events', [EventController::class, 'getGroupEvents'])->name('groups.events');
        Route::get('/{id}', [GroupController::class, 'show'])->name('groups.show.group')->where('id', '[0-9]+');
        Route::get('/edit/{id}', [GroupDetailsController::class, 'edit'])->name('groups.edit');
        Route::put('/{id}', [GroupDetailsController::class, 'update'])->name('groups.update');
        Route::delete('/{id}', [GroupDetailsController::class, 'destroy'])->name('groups.destroy');
    });


    // Profile Routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

// Default Laravel auth routes
require __DIR__ . '/auth.php';
