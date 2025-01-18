<?php

namespace App\Services;

use Firebase\JWT\JWT;

class JitsiTokenService
{
    /**
     * Generate a JWT token for Jitsi
     *
     * @param string $room Room name
     * @param string $userName User's name
     * @param bool $isModerator Is the user a moderator
     * @return string JWT token
     */
    public function generateToken(string $room, string $userName, bool $isModerator): string
    {
        $privateKey = file_get_contents(base_path('path/to/private.key')); // Path to your private key
        $payload = [
            'context' => [
                'user' => [
                    'name' => $userName,
                    'moderator' => $isModerator, // True for moderator
                ],
            ],
            'aud' => 'your-app-id', // Replace with your app ID
            'iss' => 'your-app-id', // Replace with your app ID
            'sub' => 'your-jitsi-domain', // Replace with your Jitsi domain
            'room' => $room, // Meeting room name
            'exp' => time() + 3600, // Token valid for 1 hour
        ];

        return JWT::encode($payload, $privateKey, 'RS256'); // Sign with RS256 algorithm
    }
}
