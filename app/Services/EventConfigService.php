<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;

class EventConfigService
{
    private static ?self $instance = null;

    private function __construct() {}

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getMaxEvents(): int
    {
        return Config::get('event.max_events', 100); // Default: 100
    }

    public function getAllowedCountries(): array
    {
        return Config::get('event.allowed_countries', []);
    }

    public function getAllowedLabels(): array
    {
        return Config::get('event.allowed_labels', []);
    }
}
