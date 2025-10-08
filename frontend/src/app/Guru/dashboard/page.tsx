import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PcCase } from "lucide-react";
import {
  IconUsers,
  IconBuildings,
  IconBriefcase2,
  IconScript,
  IconPhone,
  IconMapPin,
  IconMathNot,
  IconDatabaseOff,
} from "@tabler/icons-react";
import { api } from "@/lib/api/helper";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardGuru() {
  interface DataResponse {
    total_siswa: number;
    total_dudi: number;
    total_logbook: number;
    total_magang: number;
    logbook_terbaru: [];
    magang_terbaru: [];
    dudi_aktif: [];
  }

  const [data, setData] = useState<DataResponse>();

  const getDataDashbaordAdmin = async () => {
    try {
      const res = await api.get("/guru/dashboard");
      setData(res.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataDashbaordAdmin();
  }, []);

  return (
    <div className="px-[30px]  w-full flex flex-col gap-[40px]">
      <div className="w-full flex flex-col">
        <h1 className="text-[28px] font-bold">Dashboard</h1>
        <p className="text-(--color-secondary-foreground)">
          selamat datang di sistem pelaporan magang siswa SMKN 1 JENANGAN
          PONOROGO
        </p>
      </div>
      <div className="flex w-full justify-between gap-[40px]">
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
              <h1 className="text-[24px] font-bold">{data?.total_siswa}</h1>
            )}
            <p className="text-[14px] font-normal">Seluruh siswa terdaftar</p>
          </CardContent>
        </Card>
        <Card className="!w-full">
          <CardHeader>
            <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
              Dudi Partner
            </h1>
            <IconBuildings className="text-(--color-primary)" />
          </CardHeader>
          <CardContent>
            {!data ? (
              <Spinner className=" size-[20px]" />
            ) : (
              <h1 className="text-[24px] font-bold">{data?.total_dudi}</h1>
            )}
            <p className="text-[14px] font-normal">Perusahaan mitra</p>
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
            {!data ? (
              <Spinner className=" size-[20px]" />
            ) : (
              <h1 className="text-[24px] font-bold">{data?.total_magang}</h1>
            )}
            <p className="text-[14px] font-normal">Sedang aktif magang</p>
          </CardContent>
        </Card>
        <Card className="!w-full">
          <CardHeader>
            <h1 className="text-[14px] font-semibold text-(--color-secondary-foreground)">
              Total Logbook Hari Ini
            </h1>
            <IconScript className="text-(--color-primary)" />
          </CardHeader>
          <CardContent>
            {!data ? (
              <Spinner className=" size-[20px]" />
            ) : (
              <h1 className="text-[24px] font-bold">{data?.total_logbook}</h1>
            )}
            <p className="text-[14px] font-normal">laporan masuk hari ini</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full justify-between gap-[40px]">
        <div className="w-full flex flex-col gap-[40px]">
          <Card className="w-full">
            <CardHeader>
              <div className="w-max flex gap-[10px] items-center">
                <IconBriefcase2 className="text-(--color-primary)" />
                <h1 className="text-[16px] font-semibold">Magang Terbaru</h1>
              </div>
            </CardHeader>
            <CardContent className="w-full  flex flex-col gap-[10px]">
              {data?.magang_terbaru && data?.magang_terbaru.length !== 0 ? (
                data.magang_terbaru.map((Item: any, index) => (
                  <div
                    key={index}
                    className="w-full flex justify-between items-center p-[20px] rounded-[20px] border-[1px] border-(--color-border)"
                  >
                    <div className="w-max flex h-full gap-[10px]">
                      <div className="w-max h-max p-[8px] rounded-[10px] bg-(--color-primary)">
                        <IconBriefcase2 className="text-(--color-background)" />
                      </div>
                      <div className="h-full flex flex-col justify-start items-start gap-[5px]">
                        <h1 className="text-[16px] font-semibold">
                          {Item?.siswa?.nama}
                        </h1>
                        <p className="text-[14px] font-normal">
                          {Item?.dudi?.nama_perusahaan}
                        </p>
                        <p className="text-[14px] font-normal">
                          {Item?.tanggal_mulai} s.d {Item?.tanggal_selesai}
                        </p>
                      </div>
                    </div>
                    <div className="w-max h-full flex">
                      <div className="w-max h-max px-[8px] rounded-[8px] py-[5px] bg-(--color-success-background)">
                        <p className="text-[14px] font-semibold text-(--color-success)">
                          {Item?.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full flex flex-col gap-[10px] justify-center items-center mt-[30px] mb-[30px]">
                  {!data ? (
                    <Spinner className=" size-[30px]" />
                  ) : (
                    <>
                      <IconDatabaseOff
                        width={"50px"}
                        height={"50px"}
                        className="text-(--color-primary)"
                      />
                      <p>Tidak Ada Data</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <div className="w-max flex gap-[10px] items-center">
                <IconScript className="text-(--color-primary)" />
                <h1 className="text-[16px] font-semibold">Logbook Terbaru</h1>
              </div>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-[10px]">
              {data?.logbook_terbaru && data?.logbook_terbaru.length !== 0 ? (
                data.logbook_terbaru.map((Item: any, index) => {
                  let color: string;
                  let background: string;

                  if (Item?.status_verifikasi === "diterima") {
                    color = "text-(--color-success)";
                    background = "bg-(--color-success-background)";
                  } else if (Item?.status_verifikasi === "pending") {
                    color = "text-(--color-pendding)";
                    background = "bg-(--color-pendding-background)";
                  } else if (Item?.status_verifikasi === "ditolak") {
                    color = "text-(--color-error)";
                    background = "bg-(--color-error-background)";
                  }

                  return (
                    <div
                      key={index}
                      className="w-full flex justify-between items-center p-[20px] rounded-[20px] border-[1px] border-(--color-border)"
                    >
                      <div className="w-full flex h-full gap-[10px]">
                        <div className="w-max h-max p-[8px] rounded-[10px] bg-(--color-primary)">
                          <IconScript className="text-(--color-background)" />
                        </div>
                        <div className="h-full flex flex-col justify-start items-start gap-[5px]">
                          <h1 className="text-[14px] font-semibold">
                            {Item?.kegiatan}
                          </h1>
                          <p className="text-[14px] font-normal">
                            {Item?.tanggal}
                          </p>
                          <p className="text-[14px] font-medium text-orange-500 italic">
                            kendala: {Item?.kendala}
                          </p>
                        </div>
                      </div>
                      <div className="w-[130px] h-full flex justify-end">
                        <div
                          className={`w-max h-max px-[8px] rounded-[8px] py-[5px] ${background}`}
                        >
                          <p className={`text-[14px] font-semibold ${color}`}>
                            {Item?.status_verifikasi}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full flex flex-col gap-[10px] justify-center items-center mt-[30px] mb-[30px]">
                  {!data ? (
                    <Spinner className=" size-[30px]" />
                  ) : (
                    <>
                      <IconDatabaseOff
                        width={"50px"}
                        height={"50px"}
                        className="text-(--color-primary)"
                      />
                      <p>Tidak Ada Data</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-full flex flex-col">
          <Card>
            <CardHeader>
              <div className="w-max flex gap-[10px] items-center">
                <IconBuildings className="text-(--color-primary)" />
                <h1 className="text-[16px] font-semibold">Dudi Aktif</h1>
              </div>
            </CardHeader>
            <CardContent className="w-full  flex flex-col gap-[10px]">
              {data?.dudi_aktif && data?.dudi_aktif.length !== 0 ? (
                data.dudi_aktif.map((Item: any, index) => (
                  <div
                    key={index}
                    className="w-full flex justify-between items-center p-[20px] rounded-[20px] border-[1px] border-(--color-border)"
                  >
                    <div className="w-max flex h-full gap-[10px]">
                      <div className="h-full flex flex-col justify-start items-start gap-[5px]">
                        <h1 className="text-[16px] font-semibold">
                          {Item?.dudi?.nama_perusahaan}
                        </h1>
                        <div className="flex justify-center items-center gap-[5px]">
                          <IconMapPin width={"15px"} height={"15px"} />
                          <p className="text-[14px] font-normal">
                            {Item?.dudi?.alamat}
                          </p>
                        </div>
                        <div className="flex justify-center items-center gap-[5px]">
                          <IconPhone width={"15px"} height={"15px"} />
                          <p className="text-[14px] font-normal">
                            {Item?.dudi?.telepon}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-max h-full flex">
                      <div className="w-max h-max px-[8px] rounded-[8px] py-[5px] bg-(--color-success-background)">
                        <p className="text-[14px] font-semibold text-(--color-success)">
                          {Item?.total_siswa} Siswa
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full flex flex-col gap-[10px] justify-center items-center mt-[30px] mb-[30px]">
                  {!data ? (
                    <Spinner className=" size-[30px]" />
                  ) : (
                    <>
                      <IconDatabaseOff
                        width={"50px"}
                        height={"50px"}
                        className="text-(--color-primary)"
                      />
                      <p>Tidak Ada Data</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
