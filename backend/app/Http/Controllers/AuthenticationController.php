<?php

namespace App\Http\Controllers;

use App\Constants\RoleConstants;
use App\Models\Role;
use App\Models\siswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthenticationController extends Controller
{

    protected function validatorRegister(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255', 'unique:users'],
            'nis' => ['required', 'string', 'max:50'],
            'kelas' => ['required', 'string', 'max:50', 'uppercase'],
            'jurusan' => ['required', 'string', 'max:100', 'uppercase'],
            'alamat' => ['required', 'string'],
            'telepon' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ]);
    }

    protected function create(array $data)
    {
        DB::beginTransaction();
        try {

            $newUser = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role_id' => Role::where('name', RoleConstants::SISWA)->first()->id,
            ]);

            $newUser->siswa->create([
                'nama' => $data['name'],
                'nis' => $data['nis'],
                'kelas' => $data['kelas'],
                'jurusan' => $data['jurusan'],
                'alamat' => $data['alamat'],
                'telepon' => $data['telepon'],
            ]);

            DB::commit();
            return true;
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage());
            abort('500', 'Gagal Register');
        }
    }

    public function register(Request $request)
    {
        $this->validatorRegister($request->all())->validate();
        $this->create($request->all());
        return response()->json(['message' => 'Register Berhasil'], 200);
    }

    public function login(Request $request) {}

    public function logout(Request $request) {}
}
