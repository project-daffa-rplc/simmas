<?php

namespace App\Http\Controllers;

use App\Constants\DudiStatusConstant;
use App\Constants\RoleConstants;
use App\Constants\StatusMagangConstant;
use App\Models\dudi;
use App\Http\Requests\StoredudiRequest;
use App\Http\Requests\UpdatedudiRequest;
use App\Models\guru;
use App\Models\magang;
use App\Models\Role;
use App\Models\school_settings;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Enum;

class DudiController extends Controller
{

    public $dudiId;
    public $nama_perusahaan;
    public $alamat;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $role = Role::query()->where('id', Auth::user()->role_id)->first();
        $role_id = $role->id;

        if($role_id === RoleConstants::ADMIN) {
            return $this->dudiAdmin();
        } else if ($role_id === RoleConstants::GURU) {
            $this->dudiGuru();
        } else if ($role_id === RoleConstants::SISWA) {
            $this->dudiSiswa();
        }
    }

    /**
     * Show the form for creating a new resource.
     */

    /**
     * Store a newly created resource in storage.
     */
    public function dudiAdmin()
    {
        $TotalDudi = dudi::query()->count();
        $TotalDudiAktif = dudi::query()->where('status', DudiStatusConstant::aktif)->count();
        $TotalDudiNonaktif = dudi::query()->where('status', DudiStatusConstant::nonaktif)->count();
        $TotalMagang = magang::query()->whereIn('status', [StatusMagangConstant::berlangsung, StatusMagangConstant::selesai])
                            ->whereNotNull('siswa_id')
                            ->get()
                            ->count();

        $Dudi = dudi::withCount([
                'magang as total_siswa' => function ($q) {
                    $q->select(DB::raw('COUNT(DISTINCT siswa_id)'))->whereNotNull('siswa_id');
                }
            ])
            ->get();
        $user = User::all();
        $guru = guru::all();



        $statuses = [DudiStatusConstant::aktif, DudiStatusConstant::nonaktif, DudiStatusConstant::pending];

        return view('admin.dudi.index', compact('TotalDudi', 'TotalDudiAktif', 'TotalDudiNonaktif', 'TotalMagang', 'Dudi', 'statuses', 'user', 'guru'));

    }

    /**
     * Display the specified resource.
     */
    public function dudiGuru(dudi $dudi)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function dudiSiswa(dudi $dudi)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatedudiRequest $request, dudi $dudi)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
        try {
            dudi::destroy($id);
            return with('admin.dudi.index')->with(['message' => 'Dudi berhasil dihapus']);
        } catch ( \Throwable $th) {
            Log::error($th->getMessage());
            return view('admin.dudi.index')->withErrors(['message' => 'Terjadi Kesalahan'])->withInput();
        }
    }
}
