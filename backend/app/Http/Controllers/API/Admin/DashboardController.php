<?php

namespace App\Http\Controllers\API\Admin;

use App\Constants\StatusMagangConstant;
use App\Http\Controllers\Controller;
use App\Models\dudi;
use App\Models\guru;
use App\Models\logbook;
use App\Models\magang;
use App\Models\siswa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function dashboard()
    {
        try {
            $totalSiswa = siswa::query()->get()->count();
            $totalDudi = dudi::query()->get()->count();
            $totalGuru = guru::query()->get()->count();
            $totalLogbookToday = logbook::query()->where('created_at', Carbon::today())->count();
            $totalSiswaMagang = magang::query()->where('status', StatusMagangConstant::berlangsung)->count();

            $magangTerbaru = magang::query()->with(['siswa', 'dudi', 'guru'])->where('status', StatusMagangConstant::berlangsung)->orderByDesc('created_at')->limit(5)->get();
            $logbookTerbaru = logbook::query()->orderByDesc('created_at')->limit(5)->get();
            $dudiAktif = magang::select('dudi_id', DB::raw('COUNT(DISTINCT siswa_id) as total_siswa'))
                ->whereHas('dudi', function ($q) {
                    $q->where('status', 'aktif');
                })
                ->groupBy('dudi_id')
                ->with('dudi')
                ->orderByDesc('total_siswa')
                ->limit(5)
                ->get();

            return response()->json([
                'total_siswa' => $totalSiswa,
                'total_dudi' => $totalDudi,
                'total_guru' => $totalGuru,
                'total_logbook' => $totalLogbookToday,
                'total_magang' => $totalSiswaMagang,
                'magang_terbaru' => $magangTerbaru,
                'logbook_terbaru' => $logbookTerbaru,
                'dudi_aktif' => $dudiAktif,
            ], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal mengambil data'], 500);
        }
    }
}
