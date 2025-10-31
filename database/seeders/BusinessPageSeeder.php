<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BusinessPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('business_pages')->insert([
            [
                'business_Name' => 'MedTech Solutions',
                'business_description' => 'Leading medical technology company providing innovative healthcare solutions.',
                'businessType' => 'Technology',
                'businessCategory' => 'Healthcare',
                'businessEmail' => 'info@medtechsolutions.com',
                'businessContactNumber' => '+1-555-123-4567',
                'city' => 'New York',
                'state' => 'NY',
                'country' => 'USA',
                'businessWebsite' => 'https://www.medtechsolutions.com',
                'isFeaturedBusiness' => 'no',
            ],
            [
                'business_Name' => 'HealthPlus Pharmaceuticals',
                'business_description' => 'Pharmaceutical company focused on developing life-saving medications.',
                'businessType' => 'Pharmaceutical',
                'businessCategory' => 'Healthcare',
                'businessEmail' => 'contact@healthplus.com',
                'businessContactNumber' => '+1-555-987-6543',
                'city' => 'Boston',
                'state' => 'MA',
                'country' => 'USA',
                'businessWebsite' => 'https://www.healthplus.com',
                'isFeaturedBusiness' => 'yes',
            ],
            [
                'business_Name' => 'BioCare Diagnostics',
                'business_description' => 'Advanced diagnostic services and medical testing facilities.',
                'businessType' => 'Diagnostics',
                'businessCategory' => 'Healthcare',
                'businessEmail' => 'support@biocare.com',
                'businessContactNumber' => '+1-555-456-7890',
                'city' => 'Chicago',
                'state' => 'IL',
                'country' => 'USA',
                'businessWebsite' => 'https://www.biocare.com',
                'isFeaturedBusiness' => 'no',
            ],
        ]);
    }
}