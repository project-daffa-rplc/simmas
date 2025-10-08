<?php

namespace App\Http\Controllers\API\Guru;

use App\Constants\StatusMagangConstant;
use App\Http\Controllers\Controller;
use App\Models\dudi;
use App\Models\guru;
use App\Models\logbook;
use App\Models\magang;
use App\Models\siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $guru = guru::query()->where('user_id', Auth::user()->id)->first();

        if (!$guru) {
            return response()->json(['error']);
        }

        $TotalSiswa = siswa::all()->count();
        $TotalDudi = magang::query()->where('guru_id', $guru->id)->whereNotNull('dudi_id')->get()->count();
        $TotalMagang = magang::query()->where('guru_id', $guru->id)->whereIn('status', [StatusMagangConstant::berlangsung])->whereNotNull('siswa_id')->get()->count();
        $TotalLogbook = logbook::query()->whereDate('created_at', Carbon::today())
            ->whereHas('magang', function ($q) use ($guru) {
                $q->where('guru_id', $guru->id);
            })
            ->count();

        $magangTerbaru = magang::query()
            ->with('siswa', 'dudi')
            ->where('guru_id', $guru->id)
            ->whereIn('status', [StatusMagangConstant::berlangsung, StatusMagangConstant::diterima])
            ->whereNotNull('siswa_id')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();
        $logbookTerbaru = logbook::query()
            ->where('created_at', Carbon::today())
            ->whereHas('magang', function ($q) use ($guru) {
                $q->where('guru_id', $guru->id);
            })->orderByDesc('created_at')
            ->limit(5)
            ->get();
        $dudiAktif = magang::select('dudi_id', DB::raw('COUNT(DISTINCT siswa_id) as total_siswa'))
            ->whereHas('dudi', function ($q) {
                $q->where('status', 'aktif');
            })
            ->where('guru_id', $guru->id)
            ->groupBy('dudi_id')
            ->with('dudi')
            ->get();

            return response()->json([
                'total_siswa' => $TotalSiswa,
                'total_dudi' => $TotalDudi,
                'total_magang' => $TotalMagang,
                'total_logbook' => $TotalLogbook,
                'magang_terbaru' => $magangTerbaru,
                'logbook_terbaru' => $logbookTerbaru,
                'dudi_aktif' => $dudiAktif,
            ], 200);

    }
}
