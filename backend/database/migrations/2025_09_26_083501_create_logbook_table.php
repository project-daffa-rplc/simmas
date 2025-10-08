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
        Schema::create('logbook', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('magang_id')->constrained('magang', 'id')->cascadeOnUpdate()->cascadeOnDelete();
            $table->date('tanggal');
            $table->text('kegiatan');
            $table->text('kendala');
            $table->string('file', 255)->nullable();
            $table->enum('status_verifikasi', ['pending', 'diterima', 'ditolak']);
            $table->text('catatan_guru')->nullable();
            $table->text('catatan_dudi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logbook');
    }
};
