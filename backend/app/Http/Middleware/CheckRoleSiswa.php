<?php

namespace App\Http\Middleware;

use App\Constants\RoleConstants;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleSiswa
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(Auth::user()->role_id !== RoleConstants::SISWA ) {
            return response()->json(['message' => 'Anda tidak memiliki akses'], 403);
        }

        return $next($request);
    }
}
