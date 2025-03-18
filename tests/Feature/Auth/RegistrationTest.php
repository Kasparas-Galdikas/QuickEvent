<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Carbon\Carbon;
use App\Mail\VerificationMail;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the registration screen can be rendered.
     */
    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');
        $response->assertStatus(200);
    }

    /**
     * Test that new users can register.
     *
     * After registration, the user should be redirected to the verification page
     * and NOT automatically authenticated.
     */
    public function test_new_users_can_register(): void
    {
        Mail::fake(); // Fake mail so that emails are not actually sent

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        // Check that the response redirects to the verify page
        $response->assertRedirect(route('verify.page'));
        $response->assertSessionHas('status', 'Verification email sent! Please check your inbox.');

        // The user should exist in the database but not be authenticated
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
        $this->assertGuest();

        // Optionally, assert that a verification email was sent
        Mail::assertSent(VerificationMail::class);
    }

    /**
     * Test that a user can verify their email using the correct verification code.
     */
    public function test_user_can_verify_email(): void
    {
        // Create an unverified user with a verification code
        $verificationCode = random_int(100000, 999999);
        $user = User::factory()->create([
            'email_verified_at' => null,
            'verification_code' => $verificationCode,
            'password' => Hash::make('password'),
        ]);

        // Simulate a verification request (using the POST route named 'verify.code')
        $response = $this->postJson(route('verify.code'), [
            'email' => $user->email,
            'verification_code' => $verificationCode,
        ]);

        // Assert JSON response with success message and redirect_url (to Home)
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Email verified successfully.',
                     'redirect_url' => route('Home'),
                 ]);

        // Assert that the user is now verified and logged in
        $this->assertNotNull($user->fresh()->email_verified_at);
        $this->assertNull($user->fresh()->verification_code);
        $this->assertAuthenticatedAs($user);
    }

    /**
     * Test that checkUser returns that verification is required for an unverified user.
     */
    public function test_check_user_requires_verification(): void
    {
        // Create an unverified user
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        // Simulate a check-user request (using the POST route named 'check.user')
        $response = $this->postJson(route('check.user'), [
            'email' => $user->email,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['requiresVerification' => true]);
    }

    /**
     * Test that checkUser returns that verification is not required for a verified user.
     */
    public function test_check_user_does_not_require_verification(): void
    {
        // Create a verified user
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        // Simulate a check-user request (using the POST route named 'check.user')
        $response = $this->postJson(route('check.user'), [
            'email' => $user->email,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['requiresVerification' => false]);
    }

    /**
     * Test that the verification code can be resent.
     */
    public function test_resend_verification_code(): void
    {
        Mail::fake();

        // Create an unverified user
        $user = User::factory()->create([
            'email_verified_at' => null,
            'verification_code' => 123456,
        ]);

        // Simulate a resend request (using the POST route named 'verification.resend')
        $response = $this->postJson(route('verification.resend'), [
            'email' => $user->email,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'A new verification code has been sent.']);

        // Check that the user's verification code is updated in the database
        $this->assertNotEquals(123456, $user->fresh()->verification_code);

        // Assert that a new verification email was sent
        Mail::assertSent(VerificationMail::class);
    }
}
