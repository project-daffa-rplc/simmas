<?php

namespace App\Http\Controllers\API\Admin;

use App\Constants\DudiStatusConstant;
use App\Constants\StatusMagangConstant;
use App\Http\Controllers\Controller;
use App\Models\dudi;
use App\Models\guru;
use App\Models\magang;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DudiController extends Controller
{


    public function index(Request $request)
    {
        try {
            $jumlah = $request->jumlah ? $request->jumlah : 10;
            $search = $request->search;

            $TotalDudi = dudi::query()->count();
            $TotalDudiAktif = dudi::query()->where('status', DudiStatusConstant::aktif)->count();
            $TotalDudiNonaktif = dudi::query()->where('status', DudiStatusConstant::nonaktif)->count();
            $TotalMagang = magang::query()->whereIn('status', [StatusMagangConstant::berlangsung, StatusMagangConstant::selesai])
                ->whereNotNull('siswa_id')
                ->get()
                ->count();

            if($search){
                $Dudi = dudi::withCount([
                    'magang as total_siswa' => function ($q) {
                            $q->select(DB::raw('COUNT(DISTINCT siswa_id)'))->whereNotNull('siswa_id');
                        }
                    ])
                    ->when($search, function ($q)  use ($search) {
                        $q->where('nama_perusahaan', 'ILIKE', "%{$search}")
                            ->orWhere('penanggung_jawab', 'LIKE', "%{$search}%")
                            ->orWhere('alamat', 'LIKE', "%{$search}%");
                    })
                    ->get();
            }else {
                $Dudi = dudi::withCount([
                    'magang as total_siswa' => function ($q) {
                        $q->select(DB::raw('COUNT(DISTINCT siswa_id)'))->whereNotNull('siswa_id');
                    }
                ])
                ->orderByDesc('created_at')
                ->get();
            }

            return response()->json([
                'total_dudi' => $TotalDudi,
                'total_dudi_aktif' => $TotalDudiAktif,
                'total_dudi_nonaktif' => $TotalDudiNonaktif,
                'total_magang' => $TotalMagang,
                'dudi' => $Dudi,
            ], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal mengambil data'], 500);
        }
    }

    public function create(Request $request)
    {
        $rules = [
            'nama_perusahaan' => ['required', 'string', 'max:255'],
            'alamat' => ['required', 'string', 'max:255'],
            'telepon' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'penanggung_jawab' => ['required', 'string', 'max:255'],
            'status' => ['required'],
            'max_magang' => ['required', 'integer'],
        ];

        $messages = [
            'nama_perusahaan.required' => 'Nama Perusahaan tidak boleh kosong.',
            'alamat.required'          => 'Alamat tidak boleh kosong.',
            'telepon.required'         => 'Telepon tidak boleh kosong.',
            'email.required'           => 'Email tidak boleh kosong.',
            'email.email'              => 'Format email tidak valid.',
            'email.unique'             => 'Email sudah digunakan.',
            'penanggung_jawab.required' => 'Penanggung Jawab tidak boleh kosong.',
            'status.required'          => 'Status harus diisi.',
            'status.in'                => 'Status harus salah satu dari: aktif / nonaktif.',
            'max_magang.required'      => 'Jumlah maksimal magang harus diisi.',
            'max_magang.integer'       => 'Jumlah maksimal magang harus berupa angka.',
            'max_magang.min'           => 'Jumlah maksimal magang minimal 1.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message'  => $validator->errors(),
            ], 422);
        }

        dudi::create($request->all());

        return response()->json(['message' => 'Dudi berhasil dibuat'], 200);
    }

    public function show($id)
    {
        try {
            $dudi = dudi::query()->findOrFail($id);
            return response()->json($dudi, 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal mengambil data'], 500);
        }
    }

    public function edit(Request $request, $id)
    {
        try {
            $dudi = dudi::query()->findOrFail($id);
            $dudi->update($request->all());
            return response()->json(['message' => 'Dudi berhasil diupdate'], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal mengambil data'], 500);
        }
    }


    public function delete($id)
    {
        try {
            dudi::query()->findOrFail($id)->delete();
            return response()->json(['message' => 'Dudi berhasil dihapus'], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal delete data'], 500);
        }
    }
}
