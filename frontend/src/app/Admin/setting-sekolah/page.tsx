import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconBuildings,
  IconCheck,
  IconDeviceDesktop,
  IconEdit,
  IconEye,
  IconFileText,
  IconMail,
  IconMapPin,
  IconPaperclip,
  IconPepper,
  IconPhone,
  IconPrinter,
  IconSettings,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { SelectDudi } from "../dudi/action/SelectDudi";
import ImageUploadComponent from "./action/ImageUpload";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api, toastSuccess } from "@/lib/api/helper";
import { file } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from "sonner";

export default function SeetingSekolah() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<dataResponse | null>();
  const [namaSekolah, setNamaSekolah] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [kepalaSekolah, setKepalaSekolah] = useState("");
  const [website, setWebsite] = useState("");
  const [npsn, setNpsn] = useState("");
  const [logo, setLogo] = useState<File | null | string>(null);
  const [id, setId] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  interface dataResponse {
    nama_sekolah: string;
    alamat: string;
    telepon: string;
    email: string;
    kepala_sekolah: string;
    website: string;
    npsn: string;
    logo_url: string;
    updated_at: string;
  }

  const getDataSekolah = async () => {
    try {
      setLoading(!loading);
      const res = await api.get("/admin/school-setting");
      setData(res?.data?.[0]);
      setId(res?.data?.[0]?.id);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleEditSetting = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(!loading);
      setData(null);

      console.log(logo)
      const formData = new FormData();
      formData.append("nama_sekolah", namaSekolah);
      formData.append("alamat", alamat);
      formData.append("telepon", telepon);
      formData.append("email", email);
      formData.append("kepala_sekolah", kepalaSekolah);
      formData.append("website", website);
      formData.append("npsn", npsn);

      if (logo) {
        formData.append("logo", logo);
        console.log(logo)
      }
      const res = await api.post(`/admin/school-setting/${id}`, formData);

      if (res?.status === 200) {
        setMessage(res?.data?.message);
        getDataSekolah();
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataSekolah();
  }, []);

  useEffect(() => {
    if (data) {
      setNamaSekolah(data.nama_sekolah || "");
      // set localstorage
      localStorage.setItem("nama_sekolah", data.nama_sekolah);
      setAlamat(data.alamat || "");
      setTelepon(data.telepon || "");
      setEmail(data.email || "");
      setKepalaSekolah(data.kepala_sekolah || "");
      setWebsite(data.website || "");
      setNpsn(data.npsn || "");
      setLogo(data.logo_url || "");
    }
  }, [data]);

  useEffect(() => {
    if (message) {
      toastSuccess({ title: message });
    }
  }, [message]);

  return (
    <div className="px-[30px]  w-full flex flex-col gap-[40px]">
      <Toaster position="top-center" duration={2000} className="z-[100]" />
      <div className="w-full flex flex-col">
        <h1 className="text-[28px] font-bold">Pengaturan Sekolah</h1>
      </div>
      <div className="w-full flex gap-[30px]">
        <Card className="w-full ">
          <CardHeader>
            <div className="w-max flex gap-[10px] items-center">
              {data ? (
                <>
                  <IconSettings className="text-(--color-primary)" />
                  <h1 className="text-[18px] font-semibold">
                    Informasi Sekolah
                  </h1>
                </>
              ) : (
                <Skeleton className="w-[180px] h-[36px]" />
              )}
            </div>
            <div className="w-max flex justify-center items-center">
              {data ? (
                <Button
                  onClick={(e) => {
                    if (open) {
                      handleEditSetting(e);
                    }
                    setOpen(!open);
                  }}
                  className={`tracking-[.5px] font-medium cursor-pointer flex justify-center items-center`}
                >
                  {open ? (
                    <>
                      <IconCheck width={"15px"} height={"15px"} />
                      simpan
                    </>
                  ) : (
                    <>
                      <IconEdit width={"15px"} height={"15px"} />
                      edit
                    </>
                  )}
                </Button>
              ) : (
                <Skeleton className="w-[74px] h-[36px]" />
              )}
            </div>
          </CardHeader>
          <CardContent className="">
            <div className="grid gap-[30px]">
              <div className="grid gap-3">
                {data ? (
                  <h2 className="text-[14px] font-semibold flex items-center gap-2">
                    <IconUpload width={"20px"} height={"20px"} />
                    Logo Sekolah
                  </h2>
                ) : (
                  <Skeleton className="w-[80px] h-[30px]" />
                )}

                {data ? (
                  <ImageUploadComponent
                    logo={logo}
                    disabled={open}
                    onChange={(file) => setLogo(file)}
                  />
                ) : (
                  <Skeleton className="w-[100px] h-[100px] rounded-[4px]" />
                )}
              </div>
              <div className="grid gap-3">
                {data ? (
                  <Label htmlFor="nama_perusahaan">Nama Perusahaan</Label>
                ) : (
                  <Skeleton className="w-[100px] h-[30px]" />
                )}
                {data ? (
                  open ? (
                    <Input
                      required
                      id="nama_perusahaan"
                      name="nama_perusahaan"
                      onChange={(e) => setNamaSekolah(e.target.value)}
                      placeholder="Masukan Nama Perushaan"
                      value={namaSekolah}
                    />
                  ) : (
                    <div className="w-full px-3 py-2 border-1 rounded-[10px]">
                      <h1 className="text-[14px]">{namaSekolah}</h1>
                    </div>
                  )
                ) : (
                  <Skeleton className="px-3 py-2 h-[36px]" />
                )}
              </div>
              <div className="grid gap-3">
                {data ? (
                  <Label htmlFor="alamat">Alamat</Label>
                ) : (
                  <Skeleton className="w-[60px] h-[30px]" />
                )}
                {data ? (
                  open ? (
                    <Input
                      required
                      id="alamat"
                      name="alamat"
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Masukan Alamat"
                      value={alamat}
                    />
                  ) : (
                    <div className="w-full px-3 py-2 border-1 rounded-[10px]">
                      <h1 className="text-[14px]">{alamat}</h1>
                    </div>
                  )
                ) : (
                  <Skeleton className="px-3 py-2 h-[36px]" />
                )}
              </div>
              <div className="flex w-full gap-4">
                <div className="grid w-full gap-3">
                  {data ? (
                    <Label htmlFor="telepon">Telepon</Label>
                  ) : (
                    <Skeleton className="w-[80px] h-[30px]" />
                  )}
                  {data ? (
                    open ? (
                      <Input
                        required
                        id="telepon"
                        name="telepon"
                        onChange={(e) => setTelepon(e.target.value)}
                        placeholder="Masukan Telepon"
                        value={telepon}
                      />
                    ) : (
                      <div className="w-full px-3 py-2 border-1 rounded-[10px]">
                        <h1 className="text-[14px]">{telepon}</h1>
                      </div>
                    )
                  ) : (
                    <Skeleton className="px-3 py-2 h-[36px]" />
                  )}
                </div>
                <div className="grid w-full gap-3">
                  {data ? (
                    <Label htmlFor="email">Email</Label>
                  ) : (
                    <Skeleton className="w-[60px] h-[30px]" />
                  )}
                  {data ? (
                    open ? (
                      <Input
                        required
                        id="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukan Email"
                        value={email}
                      />
                    ) : (
                      <div className="w-full px-3 py-2 border-1 rounded-[10px]">
                        <h1 className="text-[14px]">{email}</h1>
                      </div>
                    )
                  ) : (
                    <Skeleton className="px-3 py-2 h-[36px]" />
                  )}
                </div>
              </div>

              <div className="grid gap-3">
                {data ? (
                  <Label htmlFor="kepala_sekolah">Kepala Sekolah</Label>
                ) : (
                  <Skeleton className="w-[100px] h-[30px]" />
                )}

                {data ? (
                  open ? (
                    <Input
                      required
                      id="kepala_sekolah"
                      name="kepala_sekolah"
                      placeholder="Masukan Kepala Sekolah"
                      onChange={(e) => setKepalaSekolah(e.target.value)}
                      value={kepalaSekolah}
                    />
                  ) : (
                    <div className="w-full px-3 py-2 border-1 rounded-[10px]">
                      <h1 className="text-[14px]">{kepalaSekolah}</h1>
                    </div>
                  )
                ) : (
                  <Skeleton className="px-3 py-2 h-[36px]" />
                )}
              </div>
              <div className="grid gap-3">
                {data ? (
                  <Label htmlFor="website">Website</Label>
                ) : (
                  <Skeleton className="w-[60px] h-[30px]" />
                )}

                {data ? (
                  open ? (
                    <Input
                      required
                      id="website"
                      name="website"
                      type="text"
                      placeholder="Masukan website"
                      onChange={(e) => setWebsite(e.target.value)}
                      value={website}
                    />
                  ) : (
                    <div className="w-full px-3 py-2 border-1 rounded-[10px]">
                      <h1 className="text-[14px]">{website}</h1>
                    </div>
                  )
                ) : (
                  <Skeleton className="px-3 py-2 h-[36px]" />
                )}
              </div>
              <div className="grid gap-3">
                {data ? (
                  <Label htmlFor="npsn">NPSN</Label>
                ) : (
                  <Skeleton className="w-[50px] h-[30px]" />
                )}

                {data ? (
                  open ? (
                    <>
                      <Input
                        required
                        id="npsn"
                        name="npsn"
                        type="number"
                        placeholder="Masukan NPSN"
                        onChange={(e) => setNpsn(e.target.value)}
                        value={npsn}
                      />
                    </>
                  ) : (
                    <div className="w-full px-3 py-2 border-1 rounded-[10px]">
                      <h1 className="text-[14px]">{npsn}</h1>
                    </div>
                  )
                ) : (
                  <Skeleton className="px-3 py-2 h-[36px]" />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {data ? (
              <h1 className="text-[14px]">
                Terakhir diupdate{" "}
                {new Date(data?.updated_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </h1>
            ) : (
              <Skeleton className="w-[215px] h-[21px]" />
            )}
          </CardFooter>
        </Card>
        <div className="w-full flex flex-col gap-[30px]">
          <Card className="!gap-[10px]">
            <CardHeader>
              <div className="w-max flex gap-[10px] items-center">
                {data ? (
                  <>
                    <IconEye className="text-(--color-primary)" />
                    <h1 className="text-[18px] font-semibold">
                      Preview Tampilan
                    </h1>
                  </>
                ) : (
                  <Skeleton className="w-max h-max text-[transparent]">
                    <IconEye className="hidden text-(--color-primary)" />
                    <h1 className="text-[18px] font-semibold">
                      Preview Tampilan
                    </h1>
                  </Skeleton>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {data ? (
                <h1>Pratinjau bagaimana informasi sekolah akan ditampilkan</h1>
              ) : (
                <Skeleton className="w-max h-max text-[transparent]">
                  {" "}
                  <h1>
                    Pratinjau bagaimana informasi sekolah akan ditampilkan
                  </h1>
                </Skeleton>
              )}
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <div className="w-max flex gap-[10px] items-center">
                {data ? (
                  <>
                    <IconDeviceDesktop className="text-(--color-primary)" />
                    <h1 className="text-[14px] font-semibold">
                      Dashboard Header
                    </h1>
                  </>
                ) : (
                  <Skeleton className="w-max h-max text-[transparent]">
                    <IconEye className="hidden text-(--color-primary)" />
                    <h1 className="text-[18px] font-semibold">
                      Dashboard Header
                    </h1>
                  </Skeleton>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {data ? (
                <div className="w-full h-max bg-(--color-primary) flex justify-start items-start p-[20px] rounded-[20px] gap-[20px]">
                  <ImageUploadComponent
                    className={"!w-[60px] !h-[60px]"}
                    logo={logo}
                    disabled={true}
                    readonly={true}
                  />
                  <div className=" h-full flex flex-col justify-center items-start text-(--color-background)">
                    <h1 className="text-[18px] font-bold">{namaSekolah}</h1>
                    <p className="font-light">Sistem Informasi Magang</p>
                  </div>
                </div>
              ) : (
                <Skeleton className="w-full h-[110px] text-[transparent]" />
              )}
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <div className="w-max flex gap-[10px] items-center">
                {data ? (
                  <>
                    <IconFileText className="text-(--color-primary)" />
                    <h1 className="text-[14px] font-semibold">
                      Header Rapor/Sertifikat
                    </h1>
                  </>
                ) : (
                  <Skeleton className="w-max h-max text-[transparent]">
                    <IconFileText className=" hidden text-(--color-primary)" />
                    <h1 className="text-[14px] font-semibold">
                      Header Rapor/Sertifikat
                    </h1>
                  </Skeleton>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {data ? (
                <div className="w-full h-max border-1 flex flex-col  rounded-[20px] gap-[20px]">
                  <div className="w-full flex justify-start items-start p-[20px] ">
                    <ImageUploadComponent
                      className={"!w-[60px] !h-[60px]"}
                      logo={logo}
                      disabled={true}
                      readonly={true}
                    />
                    <div className="h-max w-full flex flex-col justify-center items-center  gap-[5px]">
                      <h1 className="text-[18px] font-bold">{namaSekolah}</h1>
                      <p className="text-[14px] font-medium">{alamat}</p>
                      <div className="text-[14px] flex gap-[10px] font-medium">
                        <p className="">Telp: {telepon}</p>
                        <p className="">email: {email}</p>
                      </div>
                      <p>Web: {website}</p>
                    </div>
                  </div>
                  <div className="w-full h-full border-t-1 items-center flex justify-center p-[10px] ">
                    <h1 className="font-semibold">SERTIFIKAT MAGANG</h1>
                  </div>
                </div>
              ) : (
                <Skeleton className="w-full h-max text-[transparent]">
                  <div className="w-full h-max flex flex-col  rounded-[20px] gap-[20px]">
                    <div className="w-full flex justify-start items-start p-[20px] ">
                      <ImageUploadComponent
                        className={"!w-[60px] !h-[60px] !hidden"}
                        logo={logo}
                        disabled={true}
                        readonly={true}
                      />
                      <div className="h-max w-full flex flex-col justify-center items-center  gap-[5px]">
                        <h1 className="text-[18px] font-bold">{namaSekolah}</h1>
                        <p className="text-[14px] font-medium">{alamat}</p>
                        <div className="text-[14px] flex gap-[10px] font-medium">
                          <p className="">Telp: {telepon}</p>
                          <p className="">email: {email}</p>
                        </div>
                        <p>Web: {website}</p>
                      </div>
                    </div>
                    <div className="w-full h-full items-center flex justify-center p-[10px] ">
                      <h1 className="font-semibold">SERTIFIKAT MAGANG</h1>
                    </div>
                  </div>
                </Skeleton>
              )}
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <div className="w-max flex gap-[10px] items-center">
                {data ? (
                  <>
                    <IconPrinter className="text-(--color-primary)" />
                    <h1 className="text-[14px] font-semibold">Dokumen Cetak</h1>
                  </>
                ) : (
                  <Skeleton className="w-max h-max text-[transparent]">
                    <IconPrinter className=" hidden text-(--color-primary)" />
                    <h1 className="text-[14px] font-semibold">Dokumen Cetak</h1>
                  </Skeleton>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {data ? (
                <div className="w-full h-max flex flex-col rounded-[20px]">
                  <div className="w-full flex flex-col justify-start items-start p-[20px] gap-[10px]">
                    <div className="w-full flex gap-[10px]">
                      <ImageUploadComponent
                        className={"!w-[60px] !h-[60px]"}
                        logo={logo}
                        disabled={true}
                        readonly={true}
                      />
                      <div className="h-max w-full flex flex-col justify-start items-start">
                        <h1 className="text-[14px] font-bold">{namaSekolah}</h1>
                        <p className="text-[14px] font-medium">NPSN: {npsn}</p>
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-[5px]">
                      <div className="flex flex-col gap-[5px]">
                        <div className="flex justify-start items-center gap-[5px]">
                          <IconMapPin width={"15px"} height={"15px"} />
                          <p className="text-[14px]">{alamat}</p>
                        </div>
                        <div className="flex justify-start items-center gap-[5px]">
                          <IconPhone width={"15px"} height={"15px"} />
                          <p className="text-[14px]">{telepon}</p>
                        </div>
                        <div className="flex justify-start items-center gap-[5px]">
                          <IconMail width={"15px"} height={"15px"} />
                          <p className="text-[14px]">{email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-full border-t-1 items-center flex justify-start px-[20px] pt-[10px]">
                    <IconUser width={"15px"} height={"15px"} />
                    <p className="text-[14px]">{email}</p>
                  </div>
                </div>
              ) : (
                <Skeleton className="w-full h-max text-[transparent]">
                  <div className="w-full h-max flex flex-col  rounded-[20px] gap-[20px]">
                    <div className="w-full flex justify-center items-start p-[10px] ">
                      <ImageUploadComponent
                        className={"!w-[60px] !h-[60px] !hidden"}
                        logo={logo}
                        disabled={true}
                        readonly={true}
                      />
                      <div className="h-max w-full flex flex-col justify-center items-center  gap-[5px]">
                        <h1 className="text-[18px] font-bold">{namaSekolah}</h1>
                        <p className="text-[14px] font-medium">{alamat}</p>
                      </div>
                    </div>
                    <div className="w-full h-full items-center flex justify-center p-[10px] ">
                      <h1 className="font-semibold">SERTIFIKAT MAGANG</h1>
                    </div>
                  </div>
                </Skeleton>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
