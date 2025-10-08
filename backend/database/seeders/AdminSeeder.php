<?php

namespace Database\Seeders;

use App\Models\siswa;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 50; $i++) {
            $name = "Admin " . $i;

            // Buat user
            $user = User::create([
                'name' => $name,
                'email' => "Admin{$i}@example.com",
                'password' => Hash::make('password123'),
                'role_id' => 1, // sesuai permintaan
            ]);

        }
    }
}
