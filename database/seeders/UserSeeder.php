<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if user already exists
        $existingUser = DB::table('zc_mindpress_users')
            ->where('email', 'admin@medtalks.in')
            ->first();

        if (!$existingUser) {
            DB::table('zc_mindpress_users')->insert([
                'username' => 'admin',
                'password' => Hash::make('password'), // Change this in production!
                'email' => 'admin@medtalks.in',
                'userlevel' => 'admin',
                'usser_Type' => 'admin',
                'action' => 'active',
                'display_name' => 'Administrator',
                'user_registered' => now(),
                'email_verified_at' => now(),
            ]);

            $this->command->info('Admin user created successfully!');
            $this->command->info('Email: admin@medtalks.in');
            $this->command->info('Password: password');
        } else {
            $this->command->info('Admin user already exists.');
        }

        // Create a test user
        $existingTestUser = DB::table('zc_mindpress_users')
            ->where('email', 'test@medtalks.in')
            ->first();

        if (!$existingTestUser) {
            DB::table('zc_mindpress_users')->insert([
                'username' => 'testuser',
                'password' => Hash::make('password'), // Change this in production!
                'email' => 'test@medtalks.in',
                'userlevel' => 'user',
                'usser_Type' => 'admin',
                'action' => 'active',
                'display_name' => 'Test User',
                'mobile_no' => '9876543210',
                'user_registered' => now(),
                'email_verified_at' => now(),
            ]);

            $this->command->info('Test user created successfully!');
            $this->command->info('Email: test@medtalks.in');
            $this->command->info('Password: password');
        } else {
            $this->command->info('Test user already exists.');
        }
    }
}
