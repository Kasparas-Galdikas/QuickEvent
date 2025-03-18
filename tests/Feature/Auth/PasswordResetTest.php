<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the password reset link request screen can be rendered.
     */
    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');
        $response->assertStatus(200);
    }

    /**
     * Test that the reset password link can be requested.
     */
    public function test_reset_password_link_can_be_requested(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        // Post to the forgot-password route with the user's email
        $response = $this->post('/forgot-password', ['email' => $user->email]);

        // Our controller returns back with a session status if the link was sent
        $response->assertRedirect();
        $this->assertNotEmpty(session('status'));

        // Assert that a ResetPassword notification was sent to the user
        Notification::assertSentTo($user, ResetPassword::class);
    }

    /**
     * Test that the reset password screen can be rendered using a valid token.
     */
    public function test_reset_password_screen_can_be_rendered(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) {
            // Simulate a GET request to the reset-password screen using the token
            $response = $this->get('/reset-password/' . $notification->token);
            $response->assertStatus(200);
            return true;
        });
    }

    /**
     * Test that the password can be reset with a valid token.
     */
    public function test_password_can_be_reset_with_valid_token(): void
    {
        Notification::fake();
    
        $user = User::factory()->create();
    
        $this->post('/forgot-password', ['email' => $user->email]);
    
        Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
            $response = $this->post('/reset-password', [
                'token' => $notification->token,
                'email' => $user->email,
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);
    
            $response->assertSessionHasNoErrors()
                     ->assertRedirect(url('/')); // Change here to match the actual redirect
    
            return true;
        });
    }
    
}
