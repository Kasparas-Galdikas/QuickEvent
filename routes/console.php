<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use App\Services\EventService;
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('events:fetch', function (EventService $eventService) {
    $this->comment('Starting the fetch and store process...');
    Log::info('Starting the Artisan command: events:fetch');
    try {
        $eventService->fetchAndStoreUpcomingEvents();
        $this->info('Events fetched and stored successfully.');
    } catch (\Exception $e) {
        $this->error('An error occurred while fetching and storing events: ' . $e->getMessage());
    }
})->purpose('Fetch and store upcoming events from the API');