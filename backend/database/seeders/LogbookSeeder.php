<?php

namespace Database\Seeders;

use App\Models\logbook;
use App\Models\magang;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class LogbookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Ambil data magang dengan status berlangsung atau selesai
        $magangs = magang::query()->whereIn('status', ['berlangsung', 'selesai'])->get();

        foreach ($magangs as $magang) {
            // Random jumlah logbook per magang
            $jumlahLogbook = rand(3, 10);

            for ($i = 0; $i < $jumlahLogbook; $i++) {
                logbook::create([
                    'magang_id' => $magang->id,
                    'tanggal' => $faker->dateTimeBetween($magang->tamggal_mulai, $magang->tanggal_selesai)->format('Y-m-d'),
                    'kegiatan' => $faker->sentence(10),
                    'kendala' => $faker->sentence(12),
                    'file' => $faker->fileExtension(), // contoh: pdf, docx, jpg
                    'status_verifikasi' => $faker->randomElement(['pending', 'diterima', 'ditolak']),
                    'catatan_guru' => $faker->sentence(8),
                    'catatan_dudi' => $faker->sentence(8),
                ]);
            }
        }
    }
}
