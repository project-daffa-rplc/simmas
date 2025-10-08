<?php

namespace Database\Seeders;

use App\Models\dudi;
use App\Models\guru;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DudiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 1; $i <= 50; $i++) {
            $companyName = "Perusahaan " . $i;


            // Buat data Dudi dengan penanggung jawab dari guru
            dudi::create([
                'nama_perusahaan' => $companyName, // sama dengan user->name
                'alamat' => "Alamat perusahaan ke-" . $i,
                'telepon' => "08123" . str_pad($i, 7, '0', STR_PAD_LEFT),
                'email' => "kontak{$i}@dudi.com",
                'penanggung_jawab' => $faker->name,
                'status' => collect(['aktif', 'nonaktif', 'pending'])->random(),
                'max_magang' => rand(5, 20)
            ]);
        }
    }
}
