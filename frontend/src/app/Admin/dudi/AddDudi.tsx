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
import { SelectDudi } from "./action/SelectDudi";
import { api, statusDudi, toastSuccess } from "@/lib/api/helper";
import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function AddDudi() {
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [PenanggungJawab, setPenanggungJawab] = useState("");
  const [status, setStatus] = useState("");
  const [maxMagang, setMaxMagang] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleAddDudi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(!loading)
      const res = await api.post("/admin/dudi", {
        nama_perusahaan: namaPerusahaan,
        alamat,
        telepon,
        email,
        penanggung_jawab: PenanggungJawab,
        max_magang: maxMagang,
        status,
      });
      if (res?.status === 200) {
        setMessage(res?.data?.message)
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (message) {
      toastSuccess({ title: message });
      setLoading(!loading);
       setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (errorMessage) {
    }
  }, [message, errorMessage]);

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
          onSubmit={handleAddDudi}
          className="gap-[30px] w-full flex flex-col"
        >
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold">
              Tambah DUDI baru
            </DialogTitle>
            <DialogDescription>
              Lengkapi semua informasi yang diperlukan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="nama_perusahaan">Nama Perusahaan</Label>
              <Input
                required
                id="nama_perusahaan"
                name="nama_perusahaan"
                onChange={(e) => setNamaPerusahaan(e.target.value)}
                placeholder="Masukan Nama Perushaan"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                required
                id="alamat"
                name="alamat"
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Masukan Alamat"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="telepon">Telepon</Label>
              <Input
                required
                id="telepon"
                name="telepon"
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="Masukan Telepon"
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
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="penanggung_jawab">Penanggung Jawab</Label>
              <Input
                required
                id="penanggung_jawab"
                name="penanggung_jawab"
                placeholder="Masukan Penanggung Jawab"
                onChange={(e) => setPenanggungJawab(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="max_magang">Max Magang</Label>
              <Input
                required
                id="max_magang"
                name="max_magang"
                type="number"
                placeholder="Masukan Penanggung Jawab"
                onChange={(e) => setMaxMagang(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="penanggung_jawab">Status Dudi</Label>
              <SelectDudi
                onChange={(e) => setStatus(e)}
                title="Status Dudi"
                data={statusDudi}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit">
              {loading && <Spinner />}Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
