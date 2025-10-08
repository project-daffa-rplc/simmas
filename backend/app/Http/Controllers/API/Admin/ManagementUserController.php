<?php

namespace App\Http\Controllers\API\Admin;

use App\Constants\RoleConstants;
use App\Constants\StatusMagangConstant;
use App\Http\Controllers\Controller;
use App\Models\dudi;
use App\Models\guru;
use App\Models\siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

use function PHPUnit\Framework\isEmpty;

class ManagementUserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->search;

            $user = User::query()
                ->with('role')
                ->when($search, function ($q) use ($search) {
                    $q->where('name', 'ILIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%")
                        ->orWhereHas('role', function ($q) use ($search) {
                            $q->where('name', 'LIKE', "%{$search}%");
                        });
                })
                ->orderByDesc('created_at')
                ->get();

            return response()->json($user, 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'data gagal diambil'], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::query()
            ->when(User::find($id)?->role_id === RoleConstants::GURU, fn($q) => $q->with('guru'))
            ->when(User::find($id)?->role_id === RoleConstants::SISWA, fn($q) => $q->with('siswa'))
            ->findOrFail($id);
            return response()->json($user);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal mendapatkan data'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $rules = [
                'nama_lengkap' => ['required', 'string', 'max:255', 'unique:users,name'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'role' => ['required'],
                'password' => ['required', 'string'],
                'email_verified' => ['required', 'boolean'],
            ];

            $message = [
                'nama_lengkap.required' => ['Nama Lengkap wajib diisi'],
                'email.required' => ['Email wajib diisi'],
                'role.required' => ['Role wajib diisi'],
                'password.required' => ['Password wajib diisi'],
                'email_verified.required' => ['Status Verifikasi Email wajib diisi'],
                'email.unique' => ['Email sudah digunakan'],
                'nama_lengkap.unique' => ['Nama sudah digunakan']
            ];

            if ($request->role === RoleConstants::GURUSTRING) {
                $rules['nip'] = ['required', 'string'];
                $rules['alamat'] = ['required', 'string'];
                $rules['telepon'] = ['required', 'string'];

                $message['nip.required'] = ['Nip wajib diisi'];
                $message['alamat.required'] = ['Alamat wajib diisi'];
                $message['telepon'] = ['Telepon wajib diisi'];
            } else if ($request->role === RoleConstants::SISWASTRING) {
                $rules['nis'] = ['required', 'string'];
                $rules['alamat'] = ['required', 'string'];
                $rules['telepon'] = ['required', 'string'];
                $rules['kelas'] = ['required', 'string'];
                $rules['jurusan'] = ['required', 'string'];

                $message['nis.required'] = ['NISN wajib diisi'];
                $message['alamat'] = ['Alamat wajib diisi'];
                $message['telepon'] = ['Telepon wajib diisi'];
                $message['kelas'] = ['Kelas wajib diisi'];
                $message['jurusan'] = ['Jurusan wajib diisi'];
            }

            $validator = Validator::make($request->all(), $rules, $message);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message'  => $validator->errors(),
                ], 422);
            }


            $user = User::create([
                'name' => $request->nama_lengkap,
                'email' => $request->email,
                'role_id' => $request->role,
                'email_verified_at' => $request->email_verified ? now() : null,
                'password' => Hash::make($request->password),
            ]);

            if ($user->role_id === RoleConstants::GURU) {
                guru::create([
                    'user_id' => $user->id,
                    'nama' => $user->name,
                    'nip' => $request->nip,
                    'alamat' => $request->alamat,
                    'telepon' => $request->telepon,
                ]);
            } else if ($user->role_id === RoleConstants::SISWA) {
                siswa::create([
                    'user_id' => $user->id,
                    'nama' => $user->name,
                    'nis' => $request->nis,
                    'kelas' => $request->kelas,
                    'jurusan' => $request->jurusan,
                    'alamat' => $request->alamat,
                    'telepon' => $request->telepon,
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'data user berhasil ditambahkan'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal menambahkan user, coba lagi!'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $user = User::query()->findOrFail($id);

            $haveSiswa = siswa::query()->with('magang')->where('user_id', $id)->first();
            $haveGuru = guru::query()->with('magang')->where('user_id', $id)->first();

            if (!$user) {
                return response()->json(['message' => 'user tidak ditemukan'], 404);
            }

            $rules = [
                'nama_lengkap' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255'],
                'role' => ['required'],
                'email_verified' => ['required', 'bool'],
            ];

            $message = [
                'nama_lengkap.required' => ['Nama Lengkap wajib diisi'],
                'email.required' => ['Email wajib diisi'],
                'role.required' => ['Role wajib diisi'],
                'email_verified.required' => ['Status Verifikasi Email wajib diisi'],
            ];

            if ($request->role === RoleConstants::GURU) {
                $rules['nip'] = ['required', 'string'];
                $rules['alamat'] = ['required', 'string'];
                $rules['telepon'] = ['required', 'string'];

                $message['nip.required'] = ['Nip wajib diisi'];
                $message['alamat.required'] = ['Alamat wajib diisi'];
                $message['telepon'] = ['Telepon wajib diisi'];
            } else if ($request->role === RoleConstants::SISWA) {
                $rules['nis'] = ['required', 'string'];
                $rules['alamat'] = ['required', 'string'];
                $rules['telepon'] = ['required', 'string'];
                $rules['kelas'] = ['required', 'string'];
                $rules['jurusan'] = ['required', 'string'];

                $message['nisn.required'] = ['NISN wajib diisi'];
                $message['alamat'] = ['Alamat wajib diisi'];
                $message['telepon'] = ['Telepon wajib diisi'];
                $message['kelas'] = ['Kelas wajib diisi'];
                $message['jurusan'] = ['Jurusan wajib diisi'];
            }

            $validator = Validator::make($request->all(), $rules, $message);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message'  => $validator->errors(),
                ], 422);
            }

            $user->update([
                'name' => $request->nama_lengkap,
                'email' => $request->email,
                'role_id' => $request->role,
                'email_verified_at' => $request->email_verified ? now() : null,
            ]);

            if ($user->role_id === RoleConstants::GURU) {
                if ($haveSiswa) {
                    if (!($haveSiswa->magang->isEmpty())) {
                        foreach ($haveSiswa->magang as $magang) {
                            $magang->delete();
                        }
                    }
                    $haveSiswa->delete();
                }
                guru::create([
                    'user_id' => $user->id,
                    'nama' => $user->name,
                    'nip' => $request->nip,
                    'alamat' => $request->alamat,
                    'telepon' => $request->telepon,
                ]);
            } else if ($user->role_id === RoleConstants::SISWA) {
                if ($haveGuru) {
                    if (!($haveGuru->magang->isEmpty())) {
                        foreach ($haveGuru->magang as $magang) {
                            $magang->update(['guru_id' => null]);
                        }
                    }
                    $haveGuru->delete();
                }
                siswa::create([
                    'user_id' => $user->id,
                    'nama' => $user->name,
                    'nis' => $request->nis,
                    'kelas' => $request->kelas,
                    'jurusan' => $request->jurusan,
                    'alamat' => $request->alamat,
                    'telepon' => $request->telepon,
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'data user berhasil diupdate'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage());
            return response()->json(['message' => 'User gagal diedit, coba lagi!'], 400);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $userLogin = Auth::user();
            $user = User::query()->find($id);
            $getAdmin = User::query()->where('role_id', RoleConstants::ADMIN)->get();


            if($getAdmin->count() === 1) {
                return response()->json(['message' => 'User admin hanya satu, tidak dapat dihapus!'], 500);
            } else if ((string) $userLogin->id === $id) {
                return response()->json(['message' => 'Tidak bisa hapus data anda sendiri'], 500);
            }

            $haveSiswa = siswa::query()->with('magang')->where('user_id', $id)->first();
            $haveGuru = guru::query()->with('magang')->where('user_id', $id)->first();

            if (!$user) {
                return response()->json(['message' => 'user tidak ditemukan'], 404);
            }

            if ($user->role_id === RoleConstants::SISWA && $haveSiswa) {
                if (!($haveSiswa->magang->isEmpty())) {
                    foreach ($haveSiswa->magang as $magang) {
                        $magang->delete();
                    }
                }
                $haveSiswa->delete();
            } else if ($user->role_id === RoleConstants::GURU && $haveGuru) {
                if (!($haveGuru->magang->isEmpty())) {
                    foreach ($haveGuru->magang as $magang) {
                        $magang->update(['guru_id' => null]);
                    }
                }
                $haveGuru->delete();
            }

            $user->delete();

            DB::commit();
            return response()->json(['message' => 'user berhasil dihapus'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage());
            return response()->json(['message' => 'gagal menghapus user'], 500);
        }
    }
}
