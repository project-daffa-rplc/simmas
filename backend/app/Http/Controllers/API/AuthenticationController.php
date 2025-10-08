<?php

namespace App\Http\Controllers\API;

use App\Constants\RoleConstants;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthenticationController extends Controller
{
        protected function validatorRegister(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255', 'unique:users,name'],
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
                'role_id' => 3,
            ]);

            $newUser->siswa()->create([
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

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();
        if( !$user || !Hash::check($credentials['password'], $user->password) ) {
            return response()->json(['message' => 'email / password salah'], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        $role = Role::query()->where('id', $user->role_id)->first()->name;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'role' => $role
        ]);
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();
            return response()->json(['message' => 'Logout Berhasil'], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            abort('500', 'Gagal Logout');
        }
    }
}
