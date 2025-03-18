<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        // Create a user with a verified email
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);
    
        // Attempt to log in
        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);
    
        // Verify that the user is authenticated
        $this->assertAuthenticated();
    
        // Assert the response is a 200 OK with the expected JSON content
        $response->assertStatus(200);
        $response->assertJson(['status' => 'verified']);
    }
    

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
