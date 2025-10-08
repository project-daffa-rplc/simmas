<?php

namespace App\Http\Controllers\API\Guru;

use App\Constants\StatusMagangConstant;
use App\Http\Controllers\Controller;
use App\Models\dudi;
use App\Models\guru;
use App\Models\magang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DudiController extends Controller
{
    public function index(Request $request)
    {
        try {
            $jumlah_data = $request->jumlah ? $request->jumlah : 10;
            $search = $request->search;

            $guru = guru::query()->where('user_id', Auth::user()->id)->first();

            $TotalDudi = magang::query()->where('guru_id', $guru->id)->whereNotNull('dudi_id')->get()->count();
            $TotalMagang = magang::query()->where('guru_id', $guru->id)
                ->where('status', StatusMagangConstant::berlangsung)
                ->whereNotNull(['siswa_id', 'dudi_id'])
                ->get()
                ->count();
            $Magang = magang::select('dudi_id', DB::raw('COUNT(DISTINCT siswa_id) as total_siswa'))
                ->whereHas('dudi', function ($q)  use ($guru) {
                    $q->where('status', 'aktif');
                })
                ->where('guru_id', $guru->id)
                ->groupBy('dudi_id')
                ->with('dudi')
                ->get();

            $RataRata = $Magang->avg('total_siswa');

            $Dudi = magang::select('dudi_id',
                DB::raw('COUNT(DISTINCT siswa_id) as total_siswa'),
                DB::raw('MAX(created_at) as latest_created_at')
            )
                ->where('guru_id', $guru->id)
                ->orderByDesc('latest_created_at')
                ->groupBy('dudi_id')
                ->with('dudi')
                ->get();

            return response()->json([
                'total_dudi' => $TotalDudi,
                'total_magang' => $TotalMagang,
                'rata_rata_siswa' => $RataRata ? $RataRata : 0,
                'dudi' => $Dudi->map(function ($item) {
                    return [
                        'id' => $item->dudi->id,
                        'nama_perusahaan' => $item->dudi->nama_perusahaan,
                        'alamat' => $item->dudi->alamat,
                        'telepon' => $item->dudi->telepon,
                        'email' => $item->dudi->email,
                        'penanggung_jawab' => $item->dudi->penanggung_jawab,
                        'status' => $item->dudi->status,
                        'total_siswa' => $item->total_siswa
                    ];
                })
            ]);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal mengambil data'], 500);
        }
    }
}
