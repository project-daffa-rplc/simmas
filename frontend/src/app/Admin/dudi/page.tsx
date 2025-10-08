import { api } from "@/lib/api/helper";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  IconUsers,
  IconBuildings,
  IconCircleCheck,
  IconCircleX,
  IconBriefcase2,
  IconMapPin,
  IconPlus,
} from "@tabler/icons-react";
import { DataTable } from "@/components/data-table";
import { string } from "zod";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import AddDudi from "./AddDudi";
import { TableDudi } from "./table/table";
import { Toaster } from "sonner";

export default function DudiAdmin() {
  const [data, setData] = useState<DudiResponse>();
  interface DudiResponse {
    total_dudi: number;
    total_dudi_aktif: number;
    total_dudi_nonaktif: number;
    total_magang: number;
    dudi: [];
  }

  const getDudiData = async () => {
    try {
      const res = await api.get<DudiResponse>("/admin/dudi");
      setData(res?.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDudiData();
  }, []);

  return (
    <div className="px-[30px]  w-full flex flex-col gap-[40px]">
      <Toaster position="top-center" duration={2000} />
      <div className="w-full flex flex-col">
        <h1 className="text-[28px] font-bold">Manajemen DUDI</h1>
      </div>

      <div className="flex flex-col gap-[20px]">
        <div className="flex w-full justify-between gap-[20px]">
          <Card className="!w-full">
            <CardHeader>
              <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
                Total DUDI
              </h1>
              <IconBuildings className="text-(--color-primary)" />
            </CardHeader>
            <CardContent>
              <h1 className="text-[24px] font-bold">{data?.total_dudi}</h1>
              <p className="text-[14px] font-normal">Perusahaan mitra</p>
            </CardContent>
          </Card>
          <Card className="!w-full">
            <CardHeader>
              <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
                DUDI aktif
              </h1>
              <IconCircleCheck className="text-(--color-success)" />
            </CardHeader>
            <CardContent>
              <h1 className="text-[24px] font-bold">
                {data?.total_dudi_aktif}
              </h1>
              <p className="text-[14px] font-normal">Perusahaan aktif</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex w-full justify-between gap-[20px]">
          <Card className="!w-full">
            <CardHeader>
              <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
                DUDI Tidak Aktif
              </h1>
              <IconCircleX className="text-(--color-error)" />
            </CardHeader>
            <CardContent>
              <h1 className="text-[24px] font-bold">
                {data?.total_dudi_nonaktif}
              </h1>
              <p className="text-[14px] font-normal">Perusahaan tidak aktif</p>
            </CardContent>
          </Card>
          <Card className="!w-full">
            <CardHeader>
              <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
                Total Siswa Magang
              </h1>
              <IconBriefcase2 className="text-(--color-primary)" />
            </CardHeader>
            <CardContent>
              <h1 className="text-[24px] font-bold">{data?.total_magang}</h1>
              <p className="text-[14px] font-normal">Siswa magang aktif</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="w-full ">
        <CardHeader>
          <div className="w-max flex gap-[10px] items-center">
            <IconBuildings className="text-(--color-primary)" />
            <h1 className="text-[18px] font-semibold">Daftar Dudi</h1>
          </div>
          <div className="w-max flex justify-center items-center">
            <AddDudi />
          </div>
        </CardHeader>
        <CardContent className="!p-[0px]">
          {data?.dudi && <TableDudi data={data?.dudi} />}
        </CardContent>
      </Card>
    </div>
  );
}
