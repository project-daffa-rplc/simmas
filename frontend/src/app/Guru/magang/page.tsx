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
  IconUser,
  IconCheck,
  IconTimeline,
  IconCalendarTime,
} from "@tabler/icons-react";
import { DataTable } from "@/components/data-table";
import { string } from "zod";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { TableDudi } from "./table/table";
import { Toaster } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import AddMagang from "./AddMagang";

export default function MagangGuru() {
  const [data, setData] = useState<DudiResponse>();
  interface DudiResponse {
    total_aktif: number;
    total_magang: number;
    total_pending: number;
    total_selesai: number;
    data_magang: [];
    siswa: [];
    guru: [];
    dudi: [];
  }

  const getDudiData = async () => {
    try {
      const res = await api.get<DudiResponse>("/guru/management-magang");
      setData(res?.data);
      console.log(res?.data)
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
        <h1 className="text-[28px] font-bold">Manajemen Magang</h1>
      </div>

      <div className="flex flex-col gap-[20px]">
        <div className="flex w-full justify-between gap-[20px]">
          <Card className="!w-full">
            <CardHeader>
              <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
                Total Siswa
              </h1>
              <IconUsers className="text-(--color-primary)" />
            </CardHeader>
            <CardContent>
              {!data ? (
                <Spinner className=" size-[20px]" />
              ) : (
                <h1 className="text-[24px] font-bold">{data?.total_magang}</h1>
              )}
              <p className="text-[14px] font-normal">Siswa magang terdaftar</p>
            </CardContent>
          </Card>
          <Card className="!w-full">
            <CardHeader>
              <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
                Aktif
              </h1>
              <IconBriefcase2 className="text-(--color-primary)" />
            </CardHeader>
            <CardContent>
              {!data ? (
                <Spinner className=" size-[20px]" />
              ) : (
                <h1 className="text-[24px] font-bold">{data?.total_aktif}</h1>
              )}
              <p className="text-[14px] font-normal">Sedang magang</p>
            </CardContent>
          </Card>

          <Card className="!w-full">
            <CardHeader>
              <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
                Selesai
              </h1>
              <IconCheck className="text-(--color-primary)" />
            </CardHeader>
            <CardContent>
              {!data ? (
                <Spinner className=" size-[20px]" />
              ) : (
                <h1 className="text-[24px] font-bold">
                  {data?.total_selesai}
                </h1>
              )}
              <p className="text-[14px] font-normal">Per perusahaan</p>
            </CardContent>
          </Card>

          <Card className="!w-full">
            <CardHeader>
              <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
                Pending
              </h1>
              <IconCalendarTime className="text-(--color-primary)" />
            </CardHeader>
            <CardContent>
              {!data ? (
                <Spinner className=" size-[20px]" />
              ) : (
                <h1 className="text-[24px] font-bold">
                  {data?.total_pending}
                </h1>
              )}
              <p className="text-[14px] font-normal">Menunggu penempatan</p>
            </CardContent>
          </Card>

        </div>
      </div>
      <Card className="w-full ">
        <CardHeader>
          <div className="w-max flex gap-[10px] items-center">
            <IconUsers className="text-(--color-primary)" />
            <h1 className="text-[18px] font-semibold">Daftar Siswa Magang</h1>
          </div>
          <AddMagang dataSiswa={data?.siswa} dataGuru={data?.guru} dataDudi={data?.dudi}/>
        </CardHeader>
        <CardContent className="!p-[0px] flex justify-center items-center">
          {data?.data_magang ? (
            <TableDudi data={data?.data_magang} />
          ) : (
            <Spinner className=" size-[30px]" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
