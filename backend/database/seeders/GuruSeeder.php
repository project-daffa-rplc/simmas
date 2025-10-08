<?php

namespace Database\Seeders;

use App\Models\guru;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GuruSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 50; $i++) {
            $name = "Guru " . $i;

            // Buat user
            $user = User::create([
                'name' => $name,
                'email' => "guru{$i}@example.com",
                'password' => Hash::make('password123'),
                'role_id' => 2, // sesuai permintaan
            ]);

            // Buat guru relasi ke user
            guru::create([
                'user_id' => $user->id,
                'nip' => "NIP" . str_pad($i, 4, '0', STR_PAD_LEFT),
                'nama' => $name, // sama dengan user->name
                'alamat' => "Alamat guru ke-" . $i,
                'telepon' => "08213" . str_pad($i, 7, '0', STR_PAD_LEFT),
            ]);
        }
    }
}
