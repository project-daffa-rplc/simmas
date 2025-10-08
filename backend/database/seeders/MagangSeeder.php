<?php

namespace Database\Seeders;

use App\Models\dudi;
use App\Models\guru;
use App\Models\magang;
use App\Models\siswa;
use Illuminate\Database\Seeder;

class MagangSeeder extends Seeder
{
    public function run(): void
    {
        $siswaList = siswa::all();
        $dudiList  = dudi::query()->where('status', 'aktif')->get();
        $guruList = guru::all();

        if ($siswaList->isEmpty() || $dudiList->isEmpty()) {
            $this->command->warn('Seeder Siswa atau Dudi (aktif) belum ada! Jalankan seedernya dulu.');
            return;
        }

        for ($i = 1; $i <= 50; $i++) {
            $siswa = $siswaList->random();
            $dudi  = $dudiList->random();
            $guru = $guruList->random();

            $tanggalMulai   = fake()->dateTimeBetween('-1 years', 'now');
            $tanggalSelesai = (clone $tanggalMulai)->modify('+3 months');

            // pilih status acak
            $status = collect(['pending', 'diterima', 'ditolak', 'berlangsung', 'selesai', 'dibatalkan'])->random();

            // nilai_akhir hanya kalau status = selesai
            $nilaiAkhir = $status === 'selesai'
                ? fake()->randomFloat(2, 60, 100)  // nilai 60 - 100
                : null;

            magang::create([
                'siswa_id'        => $siswa->id,
                'guru_id'         => $guru->id,
                'dudi_id'         => $dudi->id,
                'status'          => $status,
                'nilai_akhir'     => $nilaiAkhir,
                'tanggal_mulai'   => $tanggalMulai->format('Y-m-d'),
                'tanggal_selesai' => $tanggalSelesai->format('Y-m-d'),
            ]);
        }
    }
}
