<?php

namespace App\Http\Controllers\Auth;

use App\Constants\RoleConstants;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $role = Role::where('name', RoleConstants::SISWA)->first();

            $rules = [
                'name' => ['required', 'string', 'max:255', 'unique:users'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255'],
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ];

            $messages = [
                'name.unique' => 'Nama sudah terdaftar',
                'name.required' => 'Nama tidak boleh kosong',
                'email.required' => 'Email tidak boleh kosong',
                'password.required' => 'Password tidak boleh kosong',
            ];

            $validate = Validator::make($request->all(), $rules, $messages);

            if ($validate->fails()) {
                Log::error('Validation failed', $validate->errors()->toArray());
                return view('auth.register')->withErrors($validate->errors()->toArray());
            }


            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role_id' => $role->id,
                'password' => Hash::make($request->password),
            ]);

            $user->siswa()->create([
                'nama' => $request->name,
                'kelas' => $request->kelas,
                'jurusan' => $request->jurusan,
                'alamat' => $request->alamat,
                'telepon' => $request->telepon,
            ]);

            event(new Registered($user));

            Auth::login($user);

            DB::commit();
            return redirect(route('dashboard', absolute: false));
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage());
            return view('auth.register')->withErrors(['message' => 'Terjadi Kesalahan Mohon Coba Lagi']);
        }
    }
}
