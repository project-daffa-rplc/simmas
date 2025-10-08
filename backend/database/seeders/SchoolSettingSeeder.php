<?php

namespace Database\Seeders;

use App\Models\school_settings;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SchoolSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        school_settings::create([
            'logo_url' => 'jhfjsdfhjfjsdf',
            'nama_sekolah' => 'SMKN 1 JENANGAN PONOROGO',
             'alamat' => 'JL. Niken Gandini, Jenangan, Ponorogo',
            'telepon' => '08438374434',
            'email' => 'stmjeh@gmail.com',
            'kepala_sekolah' => 'FARIDA',
            'npsn' => '736476547545',
            'website' => 'https://www.smkn1jenpo.sch.id/'
        ]);
    }
}
