<?php

namespace App\Http\Controllers;

use App\Constants\RoleConstants;
use App\Constants\StatusMagangConstant;
use App\Models\dudi;
use App\Models\guru;
use App\Models\logbook;
use App\Models\magang;
use App\Models\Role;
use App\Models\school_settings;
use App\Models\siswa;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $role = Role::query()->where('id', Auth::user()->role_id)->first();
        $role_id = $role->id;

        if ($role_id === RoleConstants::ADMIN) {
            return $this->dashboardAdmin();
        } else if ($role_id === RoleConstants::GURU) {
            return $this->dashboardGuru();
        } else if ($role_id === RoleConstants::SISWA) {
            return $this->dashboardSiswa();
        }
    }

    public function dashboardAdmin()
    {
        $TotalSiswa = siswa::all()->count();
        $TotalDudi = dudi::all()->count();
        $TotalMagang = magang::query()->whereIn('status', [StatusMagangConstant::berlangsung, StatusMagangConstant::diterima, StatusMagangConstant::selesai])->get()->count();
        $TotalLogbook = logbook::all()->count();

        $magangTerbaru = magang::query()->with(['siswa', 'dudi', 'guru'])->where('status', StatusMagangConstant::berlangsung)->orderByDesc('created_at')->limit(5)->get();
        $logbookTerbaru = logbook::query()->orderByDesc('created_at')->limit(5)->get();
        $dudiAktif = magang::select('dudi_id', DB::raw('COUNT(DISTINCT siswa_id) as total_siswa'))
            ->whereHas('dudi', function ($q) {
                $q->where('status', 'aktif');
            })
            ->groupBy('dudi_id')
            ->with('dudi')
            ->get();

        return view('admin.dashboard.content', compact('TotalSiswa', 'TotalDudi', 'TotalMagang', 'TotalLogbook', 'magangTerbaru', 'logbookTerbaru', 'dudiAktif'));
    }

    public function dashboardGuru()
    {
        $guru = guru::query()->where('user_id', Auth::user()->id)->first();

        if(!$guru) {
            return response()->json(['error']);
        }

        $TotalSiswa = siswa::all()->count();
        $TotalDudi = dudi::query()->where('guru_id', $guru->id)->get()->count();
        $TotalMagang = magang::query()->where('guru_id', $guru->id)->whereIn('status', [StatusMagangConstant::berlangsung, StatusMagangConstant::selesai])->whereNotNull('siswa_id')->get()->count();
        $TotalLogbook = logbook::query()->whereDate('created_at', Carbon::today())
            ->whereHas('magang',function ($q) use ($guru) {
                $q->where('guru_id', $guru->id);
            })
            ->count();

        $magangTerbaru = magang::query()
            ->with('siswa', 'dudi')
            ->where('guru_id', $guru->id)
            ->whereIn('status', [StatusMagangConstant::berlangsung, StatusMagangConstant::selesai, StatusMagangConstant::diterima])
            ->whereNotNull('siswa_id')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();
        $logbookTerbaru = logbook::query()
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

        return view('guru.dashboard.content', compact( 'TotalSiswa', 'TotalDudi', 'TotalMagang', 'TotalLogbook', 'magangTerbaru', 'logbookTerbaru', 'dudiAktif' ));
    }

    public function dashboardSiswa()
    {
        return view('siswa.dashboard.content');
    }


}
