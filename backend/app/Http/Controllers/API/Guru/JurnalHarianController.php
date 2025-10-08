<?php

namespace App\Http\Controllers\API\Guru;

use App\Constants\LOgbookStatusConstant;
use App\Http\Controllers\Controller;
use App\Models\guru;
use App\Models\logbook;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class JurnalHarianController extends Controller
{
    public function index(Request $request)
    {
        try {
            $jumlah = $request->jumlah ? $request->jumlah : 10;
            $search = $request->search;

            $user = User::query()->where('id', Auth::user()->id)->first();
            $guru = guru::query()->where('user_id', $user->id)->first();


            $logbook = logbook::query()
                ->with('magang')
                ->whereHas('magang', function ($q) use ($guru) {
                    $q->where('guru_id', $guru->id);
                })
                ->orderByDesc('created_at')
                ->get()
                ->count();

            $unverified = logbook::query()
                ->with('magang')
                ->whereHas('magang', function ($q) use ($guru) {
                    $q->where('guru_id', $guru->id)->where('status_verifikasi', LogbookStatusConstant::pending);
                })
                ->orderByDesc('created_at')
                ->get()
                ->count();

            $verified = logbook::query()
                ->with('magang')
                ->whereHas('magang', function ($q) use ($guru) {
                    $q->where('guru_id', $guru->id)->where('status_verifikasi', LogbookStatusConstant::diterima);
                })
                ->orderByDesc('created_at')
                ->get()
                ->count();

            $noverified = logbook::query()
                ->with('magang')
                ->whereHas('magang', function ($q) use ($guru) {
                    $q->where('guru_id', $guru->id)->where('status_verifikasi', LogbookStatusConstant::ditolak);
                })
                ->orderByDesc('created_at')
                ->get()
                ->count();


            if($search){
                $dataLogbook = logbook::query()
                    ->with('magang.siswa')
                    ->when($search, function ($q) use ($search) {
                        $q->where('kegiatan', 'like', "%{$search}%")
                            ->orWhere('kendala', 'like', "%{$search}%")
                            ->orWhereHas('magang.siswa', function ($s) use ($search) {
                                $s->where('nama', 'like', "%{$search}%");
                            });
                    })
                    ->whereHas('magang', function ($q) use ($guru) {
                        $q->where('guru_id', $guru->id);
                    })
                    ->where('created_at', Carbon::today())
                    ->get();
            } else {
                $dataLogbook = logbook::query()
                    ->with('magang.siswa')
                    ->whereHas('magang', function ($q) use ($guru) {
                        $q->where('guru_id', $guru->id);
                    })
                    ->where('created_at', Carbon::today())
                    ->paginate($jumlah);
            }

            return response()->json([
                'TotalLogbook' => $logbook,
                'TotalBelumDiverifikasi' => $unverified,
                'TotalDisetujui' => $verified,
                'TotalDitolak' => $noverified,
                'dataLogbook' => $dataLogbook,
            ]);

        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal mengambil data'], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::query()->where('id', Auth::user()->id)->first();
            $guru = guru::query()->where('user_id', $user->id)->first();

            $data = logbook::query()->with('magang.siswa')->whereHas('magang', function ($q) use ($guru) {
                $q->where('guru_id', $guru->id);
            })->where('id', $id)->first();

            if(!$data){
                return response()->json(['message' => 'data Jurnal tidak ada'], 404);
            }

            return response()->json($data, 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal mengambil data'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::query()->where('id', Auth::user()->id)->first();
            $guru = guru::query()->where('user_id', $user->id)->first();

            $data = logbook::query()->with('magang.siswa')->whereHas('magang', function ($q) use ($guru) {
                $q->where('guru_id', $guru->id);
            })->where('id', $id)->first();

            if(!$data){
                return response()->json(['message' => 'data jurnal tidak ada'], 404);
            }

            $request->only('catatan_guru');

            $data->update($request->all());

            return response()->json(['message' => 'data jurnal berhasil diubah'], 200);

        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal mengubah data jurnal'], 500);
        }
    }

    public function terima($id)
    {
        try {
            $user = User::query()->where('id', Auth::user()->id)->first();
            $guru = guru::query()->where('user_id', $user->id)->first();

            $data = logbook::query()->with('magang.siswa')->whereHas('magang', function ($q) use ($guru) {
                $q->where('guru_id', $guru->id);
            })->where('id', $id)->first();

            if(!$data){
                return response()->json(['message' => 'data jurnal tidak ada'], 404);
            }

            $data->update(['status_verifikasi' => LogbookStatusConstant::diterima]);

            return response()->json(['message' => 'data jurnal berhasil diterima'], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal terima data jurnal'], 500);
        }
    }

    public function tolak(Request $request, $id)
    {
        try {
            $user = User::query()->where('id', Auth::user()->id)->first();
            $guru = guru::query()->where('user_id', $user->id)->first();

            $data = logbook::query()->with('magang.siswa')->whereHas('magang', function ($q) use ($guru) {
                $q->where('guru_id', $guru->id);
            })->where('id', $id)->first();


            if(!$data){
                return response()->json(['message' => 'data jurnal tidak ada'], 404);
            } else if ($data->status_verifikasi === LogbookStatusConstant::diterima) {
                return response()->json(['message' => 'jurnal tidak dapat ditolak'], 500);
            }


            // hapus file lama
            if($data->file && Storage::disk('public')->exists($data->file)){
                Storage::disk('public')->delete($data->file);
            }

            $data->update(['status_verifikasi' => LOgbookStatusConstant::ditolak, 'file' => null]);

            return response()->json(['message' => 'data jurnal berhasil ditolak'], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal tolak data jurnal'], 500);
        }
    }

}
