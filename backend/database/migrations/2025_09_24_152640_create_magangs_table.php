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
        Schema::create('magang', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('siswa_id')->constrained('siswa', 'id')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignUuid('guru_id')->nullable()->constrained('guru', 'id')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignUuid('dudi_id')->constrained('dudi', 'id')->cascadeOnUpdate()->cascadeOnDelete();
            $table->enum('status', ['pending', 'diterima', 'ditolak', 'berlangsung', 'selesai', 'dibatalkan']);
            $table->decimal('nilai_akhir', '5', '2')->nullable();
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('magang');
    }
};
