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
import { api, toastSuccess } from "@/lib/api/helper";
import React, { useEffect, useState } from "react";
import { SelectDudi } from "./action/SelectDudi";
import { statusDudi } from "@/lib/api/helper";
import { Spinner } from "@/components/ui/spinner";

export default function EditDudi({ id, open }: { id: number; open: boolean }) {
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [PenanggungJawab, setPenanggungJawab] = useState("");
  const [status, setStatus] = useState("");
  const [maxMagang, setMaxMagang] = useState(0);

  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")

  const getDetailDudi = async () => {
    try {
      const res = await api.get(`/admin/dudi/${id}`);
      const data = res?.data;
      setNamaPerusahaan(data.nama_perusahaan);
      setAlamat(data.alamat);
      setTelepon(data.telepon);
      setEmail(data.email);
      setPenanggungJawab(data.penanggung_jawab);
      setMaxMagang(data.max_magang);
      setStatus(data.status);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleEditDudi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(!loading)
      const res = await api.put(`/admin/dudi/${id}`, {
        nama_perusahaan: namaPerusahaan,
        alamat,
        telepon,
        email,
        penanggung_jawab: PenanggungJawab,
        max_magang: maxMagang,
        status,
      });

      if (res?.status === 200) {
        setLoading(!loading)
        setMessage(res?.data?.message)
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(message) { 
      toastSuccess({title: message})
      setTimeout(() => {
         window.location.reload();
      }, 1000)
    }
  }, [message])

  useEffect(() => {
    if (open) {
      getDetailDudi();
    }
  }, [open]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <form
        onSubmit={handleEditDudi}
        className="w-full flex flex-col gap-[30px]"
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="nama_perusahaan">Nama Perusahaan</Label>
            <Input
              required
              value={namaPerusahaan}
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
              value={alamat}
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
              value={telepon}
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
              value={email}
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
              value={PenanggungJawab}
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
              value={maxMagang}
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
              value={status}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">{loading && (<Spinner/>)} Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
