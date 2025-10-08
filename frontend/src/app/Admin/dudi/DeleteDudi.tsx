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

export default function DeleteDudi({ id }: { id: number }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleDeleteDudi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(!loading);
      const res = await api.delete(`/admin/dudi/${id}`);
      if (res?.status === 200) {
        setMessage(res?.data?.message)
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
      if(message) {
        setLoading(!loading)
        toastSuccess({title: message})
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
  }, [message])

  return (
    <DialogContent className="sm:max-w-[425px]">
      <form
        onSubmit={handleDeleteDudi}
        className="w-full flex flex-col gap-[30px]"
      >
        <DialogHeader>
          <DialogTitle>Delete DUDI</DialogTitle>
          <DialogDescription>
            Apakah anda yakin ingin menghapus DUDI ini?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">{loading && (<Spinner/>)}Delete</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
