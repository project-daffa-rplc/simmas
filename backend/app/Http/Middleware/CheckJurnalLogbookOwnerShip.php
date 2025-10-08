<?php

namespace App\Http\Middleware;

use App\Models\guru;
use App\Models\logbook;
use App\Models\magang;
use App\Models\siswa;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckJurnalLogbookOwnerShip
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user()->id;
        $siswa = siswa::query()->where('user_id', $user)->first();

        $logbook = logbook::query()->where('id', $request->route('id'))->whereHas('magang', function ($query) use ($siswa) {
            $query->where('siswa_id', $siswa->id);
        })->first();
        $logbookNotFound = logbook::query()->find($request->route('id'))->first();

        if(!$logbook) {
            return response()->json(['message' => 'anda bukan pemilik jurnal ini!'], 500);
        }else if (!$logbookNotFound) {
            return response()->json(['message' => 'data jurnal tidak ditemukan!'], 500);
        }

        return $next($request);
    }
}
