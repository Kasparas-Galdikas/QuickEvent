<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Group\GroupController;
use App\Http\Controllers\Event\EventController;
use App\Http\Controllers\Event\EventsPageController; // <--- IMPORTANT: import your new controller
use App\Http\Controllers\TopicsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These 
| routes are loaded by the RouteServiceProvider and all of them will 
| be assigned to the "web" middleware group. Make something great!
|
*/

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

// Topics Routes
Route::get('/topics', [TopicsController::class, 'index'])->name('topics.index');
Route::get('/topics/filter-by-group', [TopicsController::class, 'filterByGroup'])->name('topics.filter-by-group');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    // Events Routes
    Route::prefix('events')->group(function () {
       
        Route::get('/', [EventsPageController::class, 'showEventsPage'])->name('events.index');

        // GET /events/details – Some event details page
        Route::get('/details', function () {
            return Inertia::render('Events/EventDetails');
        })->name('events.details');

        // GET /events/create – Renders the CreateEvent form
        Route::get('/create', function () {
            return Inertia::render('Events/CreateEvent');
        })->name('events.create');

        // POST /events – Handles the form submission for creating new events
        Route::post('/', [EventController::class, 'store'])->name('events.store');
    });

    // Groups Routes
    Route::prefix('groups')->group(function () {
        Route::get('/create', function () {
            return Inertia::render('Groups/CreateGroup');
        })->name('groups.create');

        Route::get('/groups/{id}', [GroupController::class, 'show'])->name('groups.show');

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

// If you still need Laravel default auth routes (optional)
require __DIR__ . '/auth.php';
