<?php

use App\Http\Controllers\API\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\API\Admin\DudiController as AdminDudiController;
use App\Http\Controllers\API\Admin\ManagementUserController;
use App\Http\Controllers\API\Admin\SchoolSettingController;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Controllers\API\Siswa\DashboardController as SiswaDashboardController;
use App\Http\Controllers\API\Guru\DashboardController as GuruDashboardController;
use App\Http\Controllers\API\Guru\DudiController as GuruDudiController;
use App\Http\Controllers\API\Siswa\DudiController as SiswaDudiController;
use App\Http\Controllers\API\Guru\ManagementMagangController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Guru\JurnalHarianController as GuruJurnalHarianController;
use App\Http\Controllers\API\Siswa\JurnalHarianController as SiswaJurnalHarianController;
use App\Http\Controllers\API\Siswa\DataMagangSiswaController;

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthenticationController::class, 'login']);
    Route::post('/register', [AuthenticationController::class, 'register']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthenticationController::class, 'logout']);

        Route::middleware('roleAdmin')->group(function () {
            Route::get('/admin/dashboard', [AdminDashboardController::class, 'dashboard']);

            Route::get('/admin/dudi', [AdminDudiController::class, 'index']);
            Route::post('/admin/dudi', [AdminDudiController::class, 'create']);
            Route::get('/admin/dudi/{id}', [AdminDudiController::class, 'show']);
            Route::delete('/admin/dudi/{id}', [AdminDudiController::class, 'delete']);
            Route::put('/admin/dudi/{id}', [AdminDudiController::class, 'edit']);

            Route::get('/admin/management-user', [ManagementUserController::class, 'index']);
            Route::get('/admin/management-user/{id}', [ManagementUserController::class, 'show']);
            Route::put('/admin/management-user/{id}', [ManagementUserController::class, 'update']);
            Route::delete('/admin/management-user/{id}', [ManagementUserController::class, 'destroy']);
            Route::post('/admin/management-user', [ManagementUserController::class, 'store']);

            Route::get('/admin/school-setting', [SchoolSettingController::class, 'index']);
            Route::post('/admin/school-setting/{id}', [SchoolSettingController::class, 'update']);
        });

        Route::middleware('roleSiswa')->group(function () {
            Route::get('/siswa/dashboard', [SiswaDashboardController::class, 'dashboard']);
            Route::get('/siswa/dudi', [SiswaDudiController::class, 'index']);
            Route::get('/siswa/dudi/{id}', [SiswaDudiController::class, 'show']);
            Route::get('/siswa/dudi/{id}/daftar', [SiswaDudiController::class, 'daftar']);
            Route::delete('/siswa/dudi/{id}/batalkan', [SiswaDudiController::class, 'batalkan']);

            Route::get('/siswa/jurnal-harian', [SiswaJurnalHarianController::class, 'index']);
            Route::post('/siswa/jurnal-harian', [SiswaJurnalHarianController::class, 'store']);

            Route::middleware('checkSiswaOwnershipJurnal')->group(function () {
                Route::get('/siswa/jurnal-harian/{id}', [SiswaJurnalHarianController::class, 'show']);
                Route::post('/siswa/jurnal-harian/{id}', [SiswaJurnalHarianController::class, 'update']);
                Route::delete('/siswa/jurnal-harian/{id}', [SiswaJurnalHarianController::class, 'destroy']);
            });

            Route::get('/siswa/magang', [DataMagangSiswaController::class, 'index']);
        });

        Route::middleware('roleGuru')->group(function () {
            Route::get('/guru/dashboard', [GuruDashboardController::class, 'dashboard']);
            Route::get("/guru/dudi", [GuruDudiController::class, 'index']);

            Route::get("/guru/management-magang", [ManagementMagangController::class, 'index']);
            Route::post("/guru/management-magang", [ManagementMagangController::class, 'store']);
            Route::get("/guru/management-magang/{id}", [ManagementMagangController::class, 'show']);

            Route::middleware('checkGuruOwnership')->group(function () {
                Route::put("/guru/management-magang/{id}", [ManagementMagangController::class, 'update']);
                Route::delete("/guru/management-magang/{id}", [ManagementMagangController::class, 'destroy']);
            });

            Route::get('/guru/jurnal-harian', [GuruJurnalHarianController::class, 'index']);
            Route::get('/guru/jurnal-harian/{id}', [GuruJurnalHarianController::class, 'show']);
            Route::put('/guru/jurnal-harian/{id}', [GuruJurnalHarianController::class, 'update']);
            Route::put('/guru/jurnal-harian/{id}/terima', [GuruJurnalHarianController::class, 'terima']);
            Route::put('/guru/jurnal-harian/{id}/tolak', [GuruJurnalHarianController::class, 'tolak']);
        });


    });

});

