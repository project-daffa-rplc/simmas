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
  statusMagang,
  toastError,
  toastSuccess,
  verification,
} from "@/lib/api/helper";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { SelectSiswa } from "./action/SelectSiswa";
import { DatePicker } from "./action/DatePicker";
import { SelectStatus } from "./action/SelectStatus";

export default function AddMagang({
  dataSiswa,
  dataGuru,
  dataDudi,
}: {
  dataSiswa: [] | undefined;
  dataGuru: [] | undefined;
  dataDudi: [] | undefined;
}) {
  const [siswa, setSiswa] = useState<string>();
  const [guru, setGuru] = useState<string>();
  const [dudi, setDudi] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [tanggalMulai, setTanggalMulai] = useState<Date>();
  const [tanggalSelesai, setTanggalSelesai] = useState<Date>();
  const [nilai, setNilai] = useState();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleAddMagang = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(!loading);
      const res = await api.post("/guru/management-magang", {
        siswa_id: siswa,
        guru_id: guru,
        dudi_id: dudi,
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
        status,
      });

      if (res?.status === 200) {
        setLoading(!loading);
        toastSuccess({ title: res?.data?.message });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error: any) {
      toastError({ message: error?.response?.data?.message });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
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
          Tambah
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form
          onSubmit={handleAddMagang}
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
