import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  admin,
  api,
  guru,
  roleSelect,
  siswa,
  toastSuccess,
  verification,
} from "@/lib/api/helper";
import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { SelectSiswa } from "./action/SelectSiswa";

export default function EditMagang({ id, open}: { id: number; open: boolean}) {
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

  const [loading, setLoading] = useState<boolean>(false)

  const getDetailUser = async () => {
    try {
      const res = await api.get(`/admin/management-user/${id}`);
      const data = res?.data;
      setNamaLengkap(data?.name);
      setEmail(data?.email);

      if (data?.email_verified_at) {
        setEmailVerification("verification");
      } else {
        setEmailVerification("unferivication");
      }

      if (data?.role_id === admin) {
        setRole("admin");
      } else if (data?.role_id === guru) {
        setRole("guru");
      } else if (data?.role_id === siswa) {
        setRole("siswa");
      }

      if (data?.siswa) {
        setAlamat(data?.siswa?.alamat);
        setTelepon(data?.siswa?.telepon);
      } else if (data?.guru) {
        setAlamat(data?.guru?.alamat);
        setTelepon(data?.guru?.telepon);
      }

      setNis(data?.siswa?.nis);
      setKelas(data?.siswa?.kelas);
      setJurusan(data?.siswa?.jurusan);
      setNip(data?.guru?.nip);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleEditSiswa = async (e: React.FormEvent<HTMLFormElement>) => {
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

      const res = await api.put(`/admin/management-user/${id}`, {
        nama_lengkap: namaLengkap,
        email,
        password,
        role: role_id,
        alamat,
        telepon,
        email_verified: email_verified,
        nis: nis,
        kelas,
        jurusan,
        nip,
      });

      if (res?.status === 200) {
        toastSuccess({title: "Berhasil Edit User"})
        setLoading(false)
        setTimeout(() => {
          return window.location.reload();
        }, 1000)
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (open) {
      getDetailUser();
    }
  }, [open]);

  return (
    <DialogContent className="sm:max-w-[425px]">
        {/* <form
          // onSubmit={handleAddMagang}
          className="gap-[30px] w-full flex flex-col"
        >
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold">
              Tambah Data Siswa Magang
            </DialogTitle>
            <DialogDescription>
              Masukkan informasi data magang siswa baru
            </DialogDescription>
          </DialogHeader>
          <div className="gap-4 flex w-full">
            <div className="grid gap-3 w-full">
              <Label htmlFor="nama_lengkap">Siswa</Label>
              <SelectSiswa
                onChange={(e) => setSiswa(e)}
                value={siswa}
                title="Pilih Siswa" 
                data={dataSiswa}
              />
            </div>
            <div className="grid gap-3 w-full">
              <Label htmlFor="nama_lengkap">Guru</Label>
              <SelectSiswa
                onChange={(e) => setGuru(e)}
                value={guru}
                title="Pilih Guru"
                data={dataGuru}
              />
            </div>
          </div>
          <div className="gap-4 grid w-full">
            <div className="grid gap-3 ">
              <Label htmlFor="nama_lengkap">Dudi</Label>
              <SelectSiswa
                onChange={(e) => setDudi(e)}
                value={dudi}
                title="Pilih Dudi"
                data={dataDudi}
              />
            </div>
          </div>
          <div className="gap-4 flex w-full">
            <div className="grid gap-3 w-full">
              <Label htmlFor="nama_lengkap">Tanggal Mulai</Label>
              <DatePicker onChange={(e) => setTanggalMulai(e)} />
            </div>
            <div className="grid gap-3 w-full">
              <Label htmlFor="nama_lengkap">Tanggal Selesai</Label>
              <DatePicker onChange={(e) => setTanggalSelesai(e)} />
            </div>
            <div className="grid gap-3 w-full">
              <Label htmlFor="nama_lengkap">Status</Label>
              <SelectStatus
                onChange={(e) => setStatus(e)}
                value={status}
                title="Pilih Status"
                data={statusMagang}
              />
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="nilai">nilai</Label>
            {status === "selesai" ? (
              <Input
                required
                id="nilai"
                name="nilai"
                onChange={(e) => setNilai(e.target.value)}
                placeholder="Masukan Nilai"
                value={nilai}
              />
            ) : (
              <>
                <Input
                  className=" !cursor-not-allowed"
                  disabled
                  required
                  id="nilai"
                  name="nilai"
                  onChange={(e) => setNilai(e.target.value)}
                  placeholder="Masukan Nilai"
                  value={nilai}
                />
                <p className="text-[12px]">Status harus selesai</p>
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit">{loading && <Spinner />} Simpan</Button>
          </DialogFooter>
        </form> */}
    </DialogContent>
  );
}
