import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";
// import { SelectDudi } from "./action/SelectDudi";
import {
  admin,
  api,
  guru,
  roleSelect,
  siswa,
  statusDudi,
  toastError,
  toastSuccess,
  verification,
} from "@/lib/api/helper";
import React, { useEffect, useState } from "react";
import { SelectRole } from "./action/SelectRole";
import { SelectVerificatio } from "./action/SelectVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

export default function AddUser() {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [alamat, setAlamat] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string | number>();
  const [emailVerification, setEmailVerification] = useState<
    string | boolean
  >();
  // state siswa
  const [nis, setNis] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [telepon, setTelepon] = useState("");
  // state siswa
  const [nip, setNip] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let role_id;
      let email_verified;

      if (role === "admin") {
        role_id = admin;
      } else if (role === "guru") {
        role_id = guru;
      } else if (role === "siswa") {
        role_id = siswa;
      }

      if (emailVerification === "verification") {
        email_verified = true;
      } else {
        email_verified = false;
      }

      const res = await api.post("/admin/management-user", {
        nama_lengkap: namaLengkap,
        email,
        password,
        role: role_id,
        alamat,
        telepon,
        email_verified: email_verified,
        nis,
        kelas,
        jurusan,
        nip,
      });
      console.log(res);

      if (res?.status === 200) {
        refreshState();
        setLoading(!loading);
        toastSuccess({ title: "Berhasil menambah user" });

        return setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error: any) {
      if (error?.response?.data?.message?.email) {
        setMessage(error?.response?.data?.message?.email?.[0]);
      }
      console.log(message);
    }
  };

  useEffect(() => {
    if (message) {
      console.log(message);
      toastError({ message: message });
      setLoading(false);
    }
  }, [message]);

  const refreshState = () => {
    setNamaLengkap("");
    setAlamat("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
    setEmailVerification("");
    setNis("");
    setKelas("");
    setJurusan("");
    setTelepon("");
    setNip("");
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-(--color-primary) cursor-pointer flex justify-center items-center px-[15px] py-[10px] rounded-[10px] gap-[8px]">
        <IconPlus
          width={"20px"}
          height={"20px"}
          className="text-(--color-background)"
        />
        <p className="text-[14px] font-normal text-(--color-background)">
          Tambah User
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleAddUser}
          className="gap-[30px] w-full flex flex-col"
        >
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold">
              Tambah User Baru
            </DialogTitle>
            <DialogDescription>
              Lengkapi semua informasi yang diperlukan
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="user">
            <TabsList>
              <TabsTrigger value="user">User</TabsTrigger>
              {role === "siswa" ? (
                <TabsTrigger value="siswa">Siswa</TabsTrigger>
              ) : null}
              {role === "guru" ? (
                <TabsTrigger value="guru">Guru</TabsTrigger>
              ) : null}
            </TabsList>
            <TabsContent className="mt-[10px]" value="user">
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                  <Input
                    required
                    id="nama_lengkap"
                    name="nama_lengkap"
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="Masukan Nama Lengkap"
                    value={namaLengkap}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    required
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukan Email"
                    value={email}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="penanggung_jawab">Role User</Label>
                  <SelectRole
                    onChange={(e) => setRole(e)}
                    title="Pilih Role"
                    data={roleSelect}
                    value={role}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    required
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukan Password"
                    value={password}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="konfirmasi_password">
                    Konfirmasi Password
                  </Label>
                  <Input
                    required
                    id="konfirmasi_password"
                    name="konfirmasi_password"
                    type="konfirmasi_password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Masukan Konfirmasi Password"
                    value={confirmPassword}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="penanggung_jawab">Email Verification</Label>
                  <SelectVerificatio
                    onChange={(e) => setEmailVerification(e)}
                    title="Verifikasi email"
                    data={verification}
                    value={emailVerification}
                  />
                </div>
              </div>
            </TabsContent>
            {role === "siswa" ? (
              <TabsContent className="mt-[10px]" value="siswa">
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="nis">NISN</Label>
                    <Input
                      required
                      id="nisn"
                      name="nisn"
                      type="text"
                      onChange={(e) => setNis(e.target.value)}
                      placeholder="Masukan NIS"
                      value={nis}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="kelas">Kelas</Label>
                    <Input
                      required
                      id="kelas"
                      name="kelas"
                      type="text"
                      onChange={(e) => setKelas(e.target.value)}
                      placeholder="Masukan Kelas"
                      value={kelas}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="jurusan">Jurusan</Label>
                    <Input
                      required
                      id="jurusan"
                      name="jurusan"
                      type="text"
                      onChange={(e) => setJurusan(e.target.value)}
                      placeholder="Masukan Jurusan"
                      value={jurusan}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="telepon">Telepon</Label>
                    <Input
                      required
                      id="telepon"
                      name="telepon"
                      type="text"
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="Masukan Telepon"
                      value={telepon}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="alamat">Alamat</Label>
                    <Input
                      required
                      id="alamat"
                      name="alamat"
                      type="text"
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Masukan Alamat"
                      value={alamat}
                    />
                  </div>
                </div>
              </TabsContent>
            ) : null}
            {role === "guru" ? (
              <TabsContent className="mt-[10px]" value="guru">
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="nis">NIP</Label>
                    <Input
                      required
                      id="nip"
                      name="nip"
                      type="text"
                      onChange={(e) => setNip(e.target.value)}
                      placeholder="Masukan NIP"
                      value={nip}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="telepon">Telepon</Label>
                    <Input
                      required
                      id="telepon"
                      name="telepon"
                      type="text"
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="Masukan Telepon"
                      value={telepon}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="alamat">Alamat</Label>
                    <Input
                      required
                      id="alamat"
                      name="alamat"
                      type="text"
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Masukan Alamat"
                      value={alamat}
                    />
                  </div>
                </div>
              </TabsContent>
            ) : null}
          </Tabs>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => refreshState()} variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button onClick={() => setLoading(!loading)} type="submit">
              {loading && <Spinner />} Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
