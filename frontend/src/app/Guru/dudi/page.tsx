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
  IconBuilding,
} from "@tabler/icons-react";
import { DataTable } from "@/components/data-table";
import { string } from "zod";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { TableDudi } from "./table/table";
import { Toaster } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function DudiGuru() {
  const [data, setData] = useState<DudiResponse>();
  interface DudiResponse {
    total_dudi: number;
    total_magang: number;
    rata_rata_siswa: number;
    dudi: [];
  }

  const getDudiData = async () => {
    try {
      const res = await api.get<DudiResponse>("/guru/dudi");
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
              {!data ? (
                <Spinner className=" size-[20px]" />
              ) : (
                <h1 className="text-[24px] font-bold">{data?.total_dudi}</h1>
              )}
              <p className="text-[14px] font-normal">Perusahaan mitra aktif</p>
            </CardContent>
          </Card>
          <Card className="!w-full">
            <CardHeader>
              <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
                Total Siswa Magang
              </h1>
              <IconUsers className="text-(--color-primary)" />
            </CardHeader>
            <CardContent>
              {!data ? (
                <Spinner className=" size-[20px]" />
              ) : (
                <h1 className="text-[24px] font-bold">{data?.total_magang}</h1>
              )}
              <p className="text-[14px] font-normal">Siswa magang aktif</p>
            </CardContent>
          </Card>

          <Card className="!w-full">
            <CardHeader>
              <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
                Rata-rata Siswa
              </h1>
              <IconBuilding className="text-(--color-primary)" />
            </CardHeader>
            <CardContent>
              {!data ? (
                <Spinner className=" size-[20px]" />
              ) : (
                <h1 className="text-[24px] font-bold">
                  {data?.rata_rata_siswa}
                </h1>
              )}
              <p className="text-[14px] font-normal">Per perusahaan</p>
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
        </CardHeader>
        <CardContent className="!p-[0px] flex justify-center items-center">
          {data?.dudi ? (
            <TableDudi data={data?.dudi} />
          ) : (
            <Spinner className=" size-[30px]" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
