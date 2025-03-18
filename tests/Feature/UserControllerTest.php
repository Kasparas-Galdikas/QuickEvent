<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\Group;

#[Group('user-location')]  // Instead of @group
class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function fetch_user_location_by_coordinates()
    {
        Http::fake([
            'https://nominatim.openstreetmap.org/*' => Http::response([
                'address' => [
                    'city' => 'New York',
                    'country_code' => 'us',
                ]
            ], 200)
        ]);

        $response = $this->getJson(route('check-location', ['lat' => '40.7128', 'lon' => '-74.0060']));

        $response->assertStatus(200);
        $response->assertJson(['location' => 'New York, US']);
        $response->assertJsonStructure(['location']);
        $this->assertNotEmpty($response->json('location'));
    }

    #[Test]
    public function fetch_user_location_by_ip()
    {
        Http::fake([
            'https://ipwho.is/*' => Http::response([
                'city' => 'Los Angeles',
                'country_code' => 'US'
            ], 200)
        ]);

        $response = $this->getJson(route('check-location'));

        $response->assertStatus(200);
        $response->assertJson(['location' => 'Los Angeles, US']);
        $this->assertMatchesRegularExpression('/, US$/', $response->json('location'));
    }

    #[Test]
    public function update_user_location()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson(route('update-location'), [
            'location' => 'San Francisco, US'
        ]);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Location updated successfully.']);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'location' => 'San Francisco, US'
        ]);
    }

    #[Test]
    public function get_stored_user_location()
    {
        $user = User::factory()->create(['location' => 'Miami, US']);
        $this->actingAs($user);

        $response = $this->getJson(route('get-location'));

        $response->assertStatus(200);
        $response->assertJson(['location' => 'Miami, US']);
    }

    #[Test]
    public function get_user_location_unauthorized()
    {
        $response = $this->getJson(route('get-location'));

        $response->assertStatus(401);
        $response->assertJson(['message' => 'Unauthenticated.']);
    }

    #[Test]
    public function handle_api_failure()
    {
        Http::fake([
            'https://nominatim.openstreetmap.org/*' => Http::response(null, 500),
        ]);

        $response = $this->getJson(route('check-location', ['lat' => '40.7128', 'lon' => '-74.0060']));

        $response->assertStatus(500);
        $response->assertJson(['error' => 'Failed to fetch precise location']);
    }

    #[Test]
    #[Group('performance')]  // Instead of @group performance
    public function performance_test_fetching_location()
    {
        Http::fake([
            'https://ipwho.is/*' => Http::response([
                'city' => 'Los Angeles',
                'country_code' => 'US'
            ], 200)
        ]);

        $startTime = microtime(true);

        $response = $this->getJson(route('check-location'));

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        $response->assertStatus(200);
        $this->assertLessThan(1, $executionTime, 'Fetching location took too long.');
    }

    #[Test]
    #[DataProvider('locationProvider')]  // Instead of @dataProvider
    public function fetch_location_with_multiple_inputs($lat, $lon, $expectedLocation)
    {
        Http::fake([
            'https://nominatim.openstreetmap.org/*' => Http::response([
                'address' => [
                    'city' => $expectedLocation,
                    'country_code' => 'us',
                ]
            ], 200)
        ]);

        $response = $this->getJson(route('check-location', ['lat' => $lat, 'lon' => $lon]));

        $response->assertStatus(200);
        $response->assertJson(['location' => "$expectedLocation, US"]);
    }

    public static function locationProvider(): array
    {
        return [
            ['40.7128', '-74.0060', 'New York'],
            ['34.0522', '-118.2437', 'Los Angeles'],
            ['41.8781', '-87.6298', 'Chicago'],
            ['37.7749', '-122.4194', 'San Francisco']
        ];
    }
}
