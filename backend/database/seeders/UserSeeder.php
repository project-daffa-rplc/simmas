<?php

namespace Database\Seeders;

use App\Constants\RoleConstants;
use App\Models\Role;
use App\Models\siswa;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 50; $i++) {
            $name = "Siswa " . $i;

            // Buat user
            $user = User::create([
                'name' => $name,
                'email' => "siswa{$i}@example.com",
                'password' => Hash::make('password123'),
                'role_id' => 3, // sesuai permintaan
            ]);

            // Buat siswa relasi ke user
            siswa::create([
                'user_id' => $user->id,
                'nama' => $name, // sama dengan user->name
                'nis' => "NIS" . str_pad($i, 4, '0', STR_PAD_LEFT),
                'kelas' => "XII-" . (($i % 3) + 1),
                'jurusan' => ["RPL", "TKJ", "AKL"][$i % 3],
                'alamat' => "Alamat siswa ke-" . $i,
                'telepon' => "08123" . str_pad($i, 7, '0', STR_PAD_LEFT),
            ]);
        }
    }
}
