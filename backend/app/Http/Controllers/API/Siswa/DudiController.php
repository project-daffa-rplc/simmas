<?php

namespace App\Http\Controllers\API\Siswa;

use App\Constants\DudiStatusConstant;
use App\Constants\StatusMagangConstant;
use App\Http\Controllers\Controller;
use App\Models\dudi;
use App\Models\magang;
use App\Models\siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use function PHPUnit\Framework\isEmpty;

class DudiController extends Controller
{
    public function index(Request $request)
    {

        try {
            $search =  $request->search;
            $jumlah = $request->jumlah ? $request->jumlah : 10;

            if($search){
                $dudi = dudi::query()
                    ->where('status', DudiStatusConstant::aktif)->with('magang')
                    ->when($search, function ($q) use ($search) {
                        $q->where('nama_perusahaan', 'ILIKE', "%{$search}");
                    })
                    ->orderByDesc('created_at')
                    ->get();
            } else {
                $dudi = dudi::query()
                    ->where('status', DudiStatusConstant::aktif)->with('magang')
                    ->orderByDesc('created_at')
                    ->paginate($jumlah);
            }

            return response()->json($dudi, 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['messafe' => 'Data gagal didapat'], 403);
        }
    }

    public function show($id)
    {
        try {
            $dudi = dudi::query()->where('status', DudiStatusConstant::aktif)->findOrFail($id);
            return response()->json($dudi, 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'data gagal didapat'], 500);
        }
    }

    public function daftar(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            $siswa = siswa::query()->where('user_id', Auth::user()->id)->first();
            $dudi = dudi::query()->findOrFail($id);

            $siswaMagang = magang::query()->where('siswa_id', $siswa->id)->whereIn('status', [StatusMagangConstant::berlangsung, StatusMagangConstant::diterima, StatusMagangConstant::selesai])->get();
            $totalDaftar = magang::query()->where('siswa_id', $siswa->id)->get()->count();
            $sudahDaftar = magang::query()->where('siswa_id', $siswa->id)->where('dudi_id', $dudi->id)->whereIn('status', [StatusMagangConstant::pending, StatusMagangConstant::diterima, StatusMagangConstant::berlangsung])->first();

            if (!($siswaMagang->isEmpty())) {
                return response()->json(['message' => 'Siswa sudah daftar / sudah magang'], 500);
            } else if ($totalDaftar === 3) {
                return response()->json(['message' => 'tidak bisa daftar lebih dari 3 perusahaan'], 500);
            } else if ($totalDaftar > $dudi->max_magang) {
                return response()->json(['message' => 'kuota magang sudah penuh'], 500);
            } else if ($sudahDaftar) {
                return response()->json(['message' => 'sudah daftar di dudi ini, tunggu konfirmasi'], 500);
            }

            magang::create([
                'siswa_id' => $siswa->id,
                'guru_id' => null,
                'dudi_id' => $dudi->id,
                'status' => StatusMagangConstant::pending,
            ]);

            DB::commit();
            return response()->json(['message' => 'Berhasil Daftar'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal daftar, coba lagi'], 400);
        }
    }

    public function batalkan($id)
    {
        try {
            DB::beginTransaction();
            $siswa = siswa::query()->where('user_id', Auth::user()->id)->first();
            $dudi = dudi::query()->findOrFail($id);
            $magang = magang::query()->where('siswa_id', $siswa->id)->where('dudi_id', $dudi->id)->where('status', StatusMagangConstant::pending)->first();

            if(!$magang) {
                return response()->json(['message' => 'magang tidak dapat dibatalkan'], 500);
            }

            $magang->update([
                'status' => StatusMagangConstant::dibatalkan
            ]);

            DB::commit();

            return response()->json(['message' => 'pendaftaran berhasil dibatalkan']);

        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'pendaftaran gagal dibatalkan'], 500);
        }
    }
}
