<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Inertia\Testing\AssertableInertia as Assert;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_profile_edit_page()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->get(route('profile.edit'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) =>
            $page->component('Profile/Edit')
                 ->where('mustVerifyEmail', $user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail)
                 ->where('status', session('status'))
        );
    }

    public function test_user_can_update_profile_information()
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
        ]);

        $this->actingAs($user);

        $response = $this->patch(route('profile.update'), [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ]);

        $response->assertRedirect(route('profile.edit'));

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'email' => 'new@example.com',
        ]);
    }

    public function test_user_can_delete_account_with_correct_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('correct-password'),
        ]);

        $this->actingAs($user);

        $response = $this->delete(route('profile.destroy'), [
            'password' => 'correct-password',
        ]);

        $response->assertRedirect('/');

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_user_cannot_delete_account_with_incorrect_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('correct-password'),
        ]);

        $this->actingAs($user);

        $response = $this->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('password');

        $this->assertDatabaseHas('users', ['id' => $user->id]); // Užtikriname, kad vartotojas nebuvo ištrintas
    }
}
