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
        Schema::create('dudi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama_perusahaan', 255);
            $table->text('alamat');
            $table->string('telepon', 255);
            $table->string('email', 255);
            $table->string('penanggung_jawab', 255);
            $table->enum('status', ['aktif', 'nonaktif', 'pending']);
            $table->integer('max_magang');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dudi');
    }
};
