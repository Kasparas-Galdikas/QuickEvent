<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\VerifyEmail;
use PHPUnit\Framework\Attributes\Test;

class EmailVerificationNotificationControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_redirects_if_email_already_verified()
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user);

        $response = $this->post(route('verification.send'));

        $response->assertRedirect(route('dashboard'));
    }

    #[Test]
    public function it_sends_verification_email_if_not_verified()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $this->actingAs($user);

        $response = $this->post(route('verification.send'));

        $response->assertRedirect();
        $response->assertSessionHas('status', 'verification-link-sent');

        Notification::assertSentTo($user, VerifyEmail::class);
    }
}
