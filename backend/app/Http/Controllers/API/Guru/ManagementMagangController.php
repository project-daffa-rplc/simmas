<?php

namespace App\Http\Controllers\API\Guru;

use App\Constants\DudiStatusConstant;
use App\Constants\StatusMagangConstant;
use App\Http\Controllers\Controller;
use App\Models\dudi;
use App\Models\guru;
use App\Models\magang;
use App\Models\siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ManagementMagangController extends Controller
{
    public function index(Request $request)
    {
        try {
            $jumlah = $request->jumlah ? $request->jumlah : 10;
            $search = $request->search;

            $user = User::query()->findOrFail(Auth::user()->id);
            $guru = guru::query()->where('user_id', $user->id)->first();

            $data_guru = guru::all();
            $siswa = siswa::whereRaw('
                (select count(*)
                from magang
                where magang.siswa_id = siswa.id
                and status in (?, ?, ?, ?)
                ) < 3
            ', [
                StatusMagangConstant::pending,
                StatusMagangConstant::berlangsung,
                StatusMagangConstant::diterima,
                StatusMagangConstant::selesai,
            ])
            ->get();
            $dudi = dudi::withCount([
                'magang as total_magang_aktif' => function ($q) {
                    $q->whereNotIn('status', [StatusMagangConstant::diterima, StatusMagangConstant::berlangsung, StatusMagangConstant::pending]);
                }
            ])
                ->where(function ($q) {
                    // belum memiliki magang
                    $q->doesntHave('magang')
                        ->orWhereHas('magang', function ($q) {
                            $q->whereIn('status', [StatusMagangConstant::ditolak, StatusMagangConstant::dibatalkan]);
                        });
                })
                ->whereRaw('(select count(*) from magang where magang.dudi_id = dudi.id and status not in (?, ?, ?)) < max_magang', [
                    StatusMagangConstant::diterima,
                    StatusMagangConstant::berlangsung,
                    StatusMagangConstant::pending
                ])
                ->where('status', DudiStatusConstant::aktif)
                ->get();

            $magang = magang::query()->where('guru_id', $guru->id)->whereNotNull('siswa_id')->get();
            $totalMagang = $magang->whereIn('status', [StatusMagangConstant::berlangsung, StatusMagangConstant::selesai, StatusMagangConstant::diterima])->count();
            $totalAktif = $magang->where('status', StatusMagangConstant::berlangsung)->count();
            $totalSelesai = $magang->where('status', StatusMagangConstant::selesai)->count();
            $totalPendding = $magang->where('status', StatusMagangConstant::pending)->count();

            $dataMagang = magang::query()
                ->with(['siswa', 'guru', 'dudi'])
                ->whereNotNull('siswa_id');

            $dataMagang = $dataMagang->when($search, function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->whereHas('siswa', function ($q) use ($search) {
                        $q->where('nama', 'ILIKE', "%{$search}%");
                    })
                        ->orWhereHas('guru', function ($q) use ($search) {
                            $q->where('nama', 'ILIKE', "%{$search}%");
                        })
                        ->orWhereHas('dudi', function ($q) use ($search) {
                            $q->where('nama_perusahaan', 'ILIKE', "%{$search}%");
                        });
                });
            })
                ->orderByDesc('created_at')
                ->get();
            // return response()->json($siswa, 400);
            return response()->json([
                'guru' => $data_guru,
                'dudi' => $dudi,
                'siswa' => $siswa,
                'total_magang' => $totalMagang,
                'total_aktif' => $totalAktif,
                'total_selesai' => $totalSelesai,
                'total_pending' => $totalPendding,
                'data_magang' => $dataMagang->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nama_siswa' => $item->siswa ? $item->siswa->nama : null,
                        'nis' => $item->siswa ?  $item->siswa->nis : null,
                        'kelas' => $item->siswa ? $item->siswa->kelas : null,
                        'jurusan' => $item->siswa ?  $item->siswa->jurusan : null,
                        'nama_guru' => $item->guru ? $item->guru->nama : null,
                        'nip' => $item->guru ? $item->guru->nip : null,
                        'nama_dudi' => $item->dudi ?  $item->dudi->nama_perusahaan : null,
                        'alamat' => $item->dudi ? $item->dudi->alamat : null,
                        'penanggung_jawab' => $item->dudi ? $item->dudi->penanggung_jawab : null,
                        'tanggal_mulai' => $item->tanggal_mulai,
                        'tanggal_selesai' => $item->tanggal_selesai,
                        'status' => $item->status,
                        'nilai' => $item->nilai_akhir,
                    ];
                }),
            ]);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal mengambil data'], 500);
        }
    }

    public function store(Request $request)
    {
        try {

            $rules = [
                'siswa_id' => ['required', 'exists:siswa,id'],
                'guru_id' => ['required', 'exists:guru,id'],
                'dudi_id' => ['required', 'exists:dudi,id'],
                'tanggal_mulai' => ['nullable', 'date'],
                'tanggal_selesai' => ['nullable', 'date'],
                'nilai_akhir' => ['nullable', 'integer'],
                'status' => ['nullable', 'in:' . implode(',', [StatusMagangConstant::berlangsung, StatusMagangConstant::selesai, StatusMagangConstant::diterima, StatusMagangConstant::pending])],
            ];

            $message = [
                'siswa_id.required' => 'siswa wajib diisi',
                'guru_id.required' => 'guru wajib diisi',
                'dudi.required' => 'dudi wajib diisi',
                'status.required' => 'status wajib diisi',
            ];

            $validator = Validator::make($request->all(), $rules, $message);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message'  => $validator->errors(),
                ], 422);
            }

            $siswaMagang = magang::query()->where('siswa_id', $request->siswa_id)->whereIn('status', [StatusMagangConstant::berlangsung, StatusMagangConstant::diterima, StatusMagangConstant::selesai])->get();
            $totalDaftar = magang::query()->where('siswa_id', $request->siswa_id)->get()->count();
            $sudahDaftar = magang::query()->where('siswa_id', $request->siswa_id)->where('dudi_id', $request->dudi_id)->whereIn('status', [StatusMagangConstant::pending, StatusMagangConstant::diterima, StatusMagangConstant::berlangsung])->get()->count();
            $dudi = dudi::query()->find($request->dudi_id);

            if (!($siswaMagang->isEmpty())) {
                return response()->json(['message' => 'Siswa sudah diterima / sudah magang'], 500);
            } else if ($totalDaftar === 3) {
                return response()->json(['message' => 'tidak bisa daftar'], 500);
            } else if ($totalDaftar > $dudi->max_magang) {
                return response()->json(['message' => 'kuota magang sudah penuh'], 500);
            } else if ($sudahDaftar !== 0) {
                return response()->json(['message' => 'siswa sudah daftar di dudi ini, tunggu konfirmasi'], 500);
            }

            // cek status magang
            if ($request->status !== StatusMagangConstant::selesai && $request->nilai_akhir) {
                return response()->json(['message' => 'magang harus selesai jika ingin menambahkan nilai akhir'], 500);
            }

            magang::query()->create([
                'siswa_id' => $request->siswa_id,
                'guru_id' => $request->guru_id,
                'dudi_id' => $request->dudi_id,
                'tanggal_mulai' => $request->tanggal_mulai,
                'tanggal_selesai' => $request->tanggal_selesai,
                'status' => $request->status,
                'niai_akhir' => $request->niai_akhir,
            ]);

            return response()->json(['message' => 'Berhasil menambahkan magang'], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal mendaftarkan magang siswa, coba lagi!'], 500);
        }
    }

    public function show($id)
    {
        try {
            $magang = magang::query()->with(['siswa', 'dudi', 'guru'])->find($id);

            if (!$magang) {
                return response()->json(['message' => 'data magang tidak ditemukan'], 404);
            }

            return response()->json($magang);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal mengambil data'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'siswa_id' => ['required', 'exists:siswa,id'],
                'guru_id' => ['required', 'exists:guru,id'],
                'dudi_id' => ['required', 'exists:dudi,id'],
                'tanggal_mulai' => ['nullable', 'date'],
                'tanggal_selesai' => ['nullable', 'date'],
                'nilai_akhir' => ['nullable', 'integer'],
                'status' => ['nullable', 'in:' . implode(',', [StatusMagangConstant::berlangsung, StatusMagangConstant::selesai, StatusMagangConstant::diterima, StatusMagangConstant::pending])],
            ];

            $message = [
                'siswa_id.required' => 'siswa wajib diisi',
                'guru_id.required' => 'guru wajib diisi',
                'dudi.required' => 'dudi wajib diisi',
                'status.required' => 'status wajib diisi',
            ];

            $validator = Validator::make($request->all(), $rules, $message);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message'  => $validator->errors(),
                ], 422);
            }

            $magang = magang::query()->find($id);


            if (($request->tanggal_mulai && $request->tanggal_selesai) && ($request->status !== StatusMagangConstant::berlangsung || $request->status === StatusMagangConstant::berlangsung)) {
                DB::beginTransaction();
                $magang->update([
                    'siswa_id' => $request->siswa_id,
                    'guru_id' => $request->guru_id,
                    'dudi_id' => $request->dudi_id,
                    'tanggal_mulai' => $request->tanggal_mulai,
                    'tanggal_selesai' => $request->tanggal_selesai,
                    'status' => StatusMagangConstant::berlangsung,
                ]);

                $magang->where('siswa_id', $request->siswa_id)->where('status', StatusMagangConstant::pending)->update([
                    'status' => StatusMagangConstant::ditolak,
                ]);
                DB::commit();
                return response()->json(['message' => 'Berhasil mengubah data magang'], 200);
            } else if ($request->status !== StatusMagangConstant::selesai && $request->nilai_akhir) {
                return response()->json(['message' => 'magang harus selesai jika ingin menambahkan nilai akhir'], 500);
            }

            $magang->update($request->all());

            return response()->json(['message' => 'Berhasil mengubah data magang'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal mengubah data'], 500);
        }
    }
    public function destroy(Request $request, $id)
    {
        try {
            magang::query()->find($id)->delete();
            return response()->json(['message' => 'Berhasil menghapus data magang'], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal menghapus data magang'], 500);
        }
    }
}
