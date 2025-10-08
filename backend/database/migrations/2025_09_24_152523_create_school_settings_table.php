<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('school_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('logo_url', 255)->nullable();
            $table->string('nama_sekolah', 255);
            $table->text('alamat');
            $table->string('telepon', 255);
            $table->string('email', 255);
            $table->string('website', 255);
            $table->string('kepala_sekolah', 255);
            $table->string('npsn', 20);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_settings');
    }
};
