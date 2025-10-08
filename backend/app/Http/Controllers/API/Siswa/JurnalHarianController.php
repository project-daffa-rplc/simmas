<?php

namespace App\Http\Controllers\API\Siswa;

use App\Constants\LOgbookStatusConstant;
use App\Constants\StatusMagangConstant;
use App\Http\Controllers\Controller;
use App\Models\logbook;
use App\Models\magang;
use App\Models\siswa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use function Illuminate\Events\queueable;

class JurnalHarianController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->search;
            $jumlah = $request->jumlah ? $request->jumlah : 10;

            $user = User::query()->find(Auth::user()->id);
            $siswa = siswa::query()->where('user_id', $user->id)->first();

            $jurnal = logbook::query()->whereHas('magang', function ($query) use ($siswa) {
                    $query->where('siswa_id', $siswa->id);
                });

            $haveJurnalToday =logbook::query()->whereHas('magang', function ($query) use ($siswa) {
                $query->where('siswa_id', $siswa->id)->where('status', StatusMagangConstant::berlangsung);
            })
            ->where('created_at', Carbon::today())
            ->first();

            $notHaveJurnalToday = !$haveJurnalToday ? true : false;

            $TotalJurnal = (clone $jurnal)->count();
            $TotalDisetujui = (clone $jurnal)->where('status_verifikasi', LogbookStatusConstant::diterima)->count();
            $TotalDitolak = (clone $jurnal)->where('status_verifikasi', LogbookStatusConstant::ditolak)->count();
            $TotalPendding = (clone $jurnal)->where('status_verifikasi', LogbookStatusConstant::pending)->count();


            if ($search) {
                $dataJurnal = (clone $jurnal)->when($search, function ($query) use ($search) {
                    $query->where('kendala', 'ILIKE', "%{$search}%")
                    ->orWhere('kegiatan', 'LIKE', "%{$search}%");
                })->where('created_at', Carbon::today())->get();
            } else {
                $dataJurnal = (clone $jurnal)->where('created_at', Carbon::today())->paginate($jumlah);
            }

            return response()->json([
                'notification_jurnal' => $notHaveJurnalToday,
                'TotalJurnal' => $TotalJurnal,
                'TotalDisetujui' => $TotalDisetujui,
                'TotalDitolak' => $TotalDitolak,
                'TotalPendding' => $TotalPendding,
                'dataJurnal' => $dataJurnal,
            ], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal mengambil data'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = User::query()->find(Auth::user()->id);
            $siswa = siswa::query()
                ->where('user_id', $user->id)
                ->first();
            $magang = $siswa->magang()->where('status', StatusMagangConstant::berlangsung)->first();

            if(!$magang){
                return response()->json(['status' => false, 'message' => 'Anda Belum Melaksanakan Magang'], 500);
            }

            $rules = [
                'tanggal' => ['required', 'date'],
                'kegiatan' => ['required', 'string'],
                'kendala' => ['required', 'string'],
                'file' => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx', 'max:20480'],
            ];

            $messages = [
                'tanggal.required' => 'Tanggal harus diisi!',
                'kegiatan.required' => 'Kegiatan harus diisi!',
                'kendala.required' => 'Kendala harus diisi!',
                'file.required' => 'File harus diisi!',
                'file.file' => 'harus berupa file!',
                'file.mimes' => 'harus berformat pdf,doc,docx,ppt,pptx,xls,xlsx!',
                'file.max' => 'Ukuran file maksimal 20 MB!',
            ];

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message'  => $validator->errors(),
                ], 422);
            }

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
                // simpan di storage/app/public/images
                $path = $file->storeAs("logbook/{$siswa->nama}", $filename, 'public');
            }

            Logbook::query()->create([
                'tanggal' => $request->tanggal,
                'kegiatan' => $request->kegiatan,
                'kendala' => $request->kendala,
                'file' => $path,
                'magang_id' => $magang->id,
                'status_verifikasi' => LogbookStatusConstant::pending,
            ]);

            DB::commit();
            return response()->json(['message' => 'Berhasil membuat jurnal'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal menambahkan data jurnal'], 500);
        }
    }


    public function show($id)
    {
        try {
            $jurnal = logbook::query()->with('magang.siswa')->find($id);
            return response()->json($jurnal);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal mengambil data'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $user = User::query()->find(Auth::user()->id);
            $siswa = siswa::query()
                ->where('user_id', $user->id)
                ->first();
            $magang = $siswa->magang()->where('status', StatusMagangConstant::berlangsung)->first();

            if(!$magang){
                return response()->json(['status' => false, 'message' => 'Anda Belum Melaksanakan Magang'], 500);
            }

            $logbook = Logbook::query()->where('magang_id', $magang->id)->where('status_verifikasi', LOgbookStatusConstant::ditolak)->find($id);

            if(!$logbook){
                return response()->json(['status' => false, 'message' => 'Jurnal harus ditolak / jurnal tidak ditemukan'], 500);
            }

            $rules = [
                'tanggal' => ['required', 'date'],
                'kegiatan' => ['required', 'string'],
                'kendala' => ['required', 'string'],
                'file' => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx', 'max:20480'],
            ];

            $messages = [
                'tanggal.required' => 'Tanggal harus diisi!',
                'kegiatan.required' => 'Kegiatan harus diisi!',
                'kendala.required' => 'Kendala harus diisi!',
                'file.required' => 'File harus diisi!',
                'file.file' => 'harus berupa file!',
                'file.mimes' => 'harus berformat pdf,doc,docx,ppt,pptx,xls,xlsx!',
                'file.max' => 'Ukuran file maksimal 20 MB!',
            ];

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message'  => $validator->errors(),
                ], 422);
            }

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
                // simpan di storage/app/public/images
                $path = $file->storeAs("logbook/{$siswa->nama}", $filename, 'public');
            }

            $logbook->update([
                'tanggal' => $request->tanggal,
                'kegiatan' => $request->kegiatan,
                'kendala' => $request->kendala,
                'file' => $path,
                'status_verifikasi' => LogbookStatusConstant::pending,
            ]);

            DB::commit();
            return response()->json(['message' => 'Berhasil mengubah data jurnal'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal mengubah data jurnal'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::query()->find(Auth::user()->id);
            $siswa = siswa::query()
                ->where('user_id', $user->id)
                ->first();
            $magang = $siswa->magang()->where('status', StatusMagangConstant::berlangsung)->first();

            if(!$magang){
                return response()->json(['status' => false, 'message' => 'Anda Belum Melaksanakan Magang'], 500);
            }

            $logbook = Logbook::query()->where('magang_id', $magang->id)->whereIn('status_verifikasi', [LOgbookStatusConstant::ditolak, LOgbookStatusConstant::pending])->find($id);

            $logbook->delete();

            return response()->json(['message' => 'Berhasil menghapus data jurnal'], 200);

        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal menghapus data jurnal'], 500);
        }
    }



}
