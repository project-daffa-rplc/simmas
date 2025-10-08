<?php

namespace App\Http\Controllers\API\Siswa;

use App\Constants\StatusMagangConstant;
use App\Http\Controllers\Controller;
use App\Models\magang;
use App\Models\siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DataMagangSiswaController extends Controller
{
    public function index()
    {
        try {
            $user = User::query()->find(Auth::user()->id);
            $siswa = Siswa::query()->where('user_id', $user->id)->first();
            $magang = magang::query()->with(['dudi', 'guru'])->where('siswa_id', $siswa->id)->where('status', StatusMagangConstant::berlangsung)->first();

            if(!$magang){
                return response()->json(['message' => 'anda belum magang'], 404);
            }

            return response()->json($magang, 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Gagal mengambil data'], 500);
        }
    }
}
