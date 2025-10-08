<?php

namespace App\Http\Middleware;

use App\Models\guru;
use App\Models\magang;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckGuruOwnerShip
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user()->id;
        $guru = guru::query()->where('user_id', $user)->first();

        $magang = magang::query()->find($request->route('id'));
        $magangNotFound = magang::query()->find($request->route('id'))->first();

        if(($magang->guru_id !== null) && ($magang->guru_id !== $guru->id)) {
            return response()->json(['message' => 'anda bukan guru pembimbing siswa ini!'], 500);
        }else if (!$magangNotFound) {
            return response()->json(['message' => 'data magang tidak ditemukan!'], 500);
        }

        return $next($request);
    }
}
