import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconBuildings } from "@tabler/icons-react";
import { TableDudi } from "../dudi/table/table";
import AddDudi from "../dudi/AddDudi";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/helper";
import { TableManagement } from "./table/table";
import AddUser from "./AddUser";
import { Toaster } from "sonner";

export default function ManagementUserAdmin() {
  const [data, setData] = useState([]);

  const getDataUser = async () => {
    try {
      const res = await api.get("/admin/management-user");
      setData(res?.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataUser();
  }, []);

  return (
    <>
      <Toaster position="top-center" duration={2000} className="z-[100]" />
      <div className="px-[30px]  w-full flex flex-col gap-[40px]">
        <div className="w-full flex flex-col">
          <h1 className="text-[28px] font-bold">Manajemen User</h1>
        </div>

        <Card className="w-full ">
          <CardHeader>
            <div className="w-max flex gap-[10px] items-center">
              <IconBuildings className="text-(--color-primary)" />
              <h1 className="text-[18px] font-semibold">Tambah User</h1>
            </div>
            <div className="w-max flex justify-center items-center">
              <AddUser />
            </div>
          </CardHeader>
          <CardContent className="!p-[0px]">
            {data.length !== 0 && <TableManagement data={data} />}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
