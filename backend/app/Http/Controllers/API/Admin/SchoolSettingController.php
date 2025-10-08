<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\school_settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SchoolSettingController extends Controller
{
    public function index()
    {
        try {
            $schoolSetting = school_settings::all();
            return response()->json($schoolSetting);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'data gagal ambil'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $rules = [
                'logo_url' => ['nullable    ', 'file', 'mimes:jpg,png,jpeg', 'max:20480'],
                'nama_sekolah' => ['required', 'string', 'max:255'],
                'alamat' => ['required', 'string', 'max:255'],
                'telepon' => ['required', 'string', 'max:50'],
                'email' => ['required', 'string', 'email', 'max:255'],
                'website' => ['nullable', 'string', 'max:255'],
                'kepala_sekolah' => ['required', 'string', 'max:255'],
            ];

            $message = [
                'logo_url.required' => 'Logo Url wajib disii',
                'logo_url.mimes' => 'Logo Url harus jpg,png,jpeg',
                'logo_url.max' => 'Minimal size dibawah 5mb',
                'nama_sekolah.required' => 'Nama Sekolah wajib disii',
                'alamat.required' => 'Alamat wajib disii',
                'telepon.required' => 'Telepom wajib disii',
                'email.required' => 'Email wajib disii',
                'email.email' => 'harus format email',
                'website.required' => 'Website wajib disii',
                'kepala_sekolah.required' => 'Kepala Sekolah wajib disii',
            ];

            $validator = Validator::make($request->all(), $rules, $message);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message'  => $validator->errors(),
                ], 422);
            }

            $schoolSetting = school_settings::query()->find($id);

            if (!$schoolSetting) {
                return response()->json(['message' => 'data tidak ditemukan'], 404);
            }

            $dataUpdate = $request->only([
                'nama_sekolah',
                'alamat',
                'telepon',
                'email',
                'website',
                'kepala_sekolah',
            ]);

            if ($request->hasFile('logo_url')) {
                // hapus file lama
                if($schoolSetting->logo_url && Storage::disk('public')->exists($schoolSetting->logo_url)){
                    Storage::disk('public')->delete($schoolSetting->logo_url);
                }

                $file = $request->file('logo_url');
                $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
                // simpan di storage/app/public/images
                $path = $file->storeAs('images', $filename, 'public');
                $dataUpdate['logo_url'] = $path;
            }

            $schoolSetting->update($dataUpdate);

            DB::commit();
            return response()->json(['message' => 'data berhasil diupdate'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage());

            return response()->json(['message' => 'data gagal diupdate'], 500);
        }
    }
}
