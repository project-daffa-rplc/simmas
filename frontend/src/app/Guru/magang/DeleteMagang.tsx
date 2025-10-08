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
import { Spinner } from "@/components/ui/spinner";
import { api, toastError } from "@/lib/api/helper";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function DeleteMagang({ id }: { id: number }) {
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>();

  const handleDeleteDudi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.delete(`/admin/management-user/${id}`);
      if (res?.status === 200) {
        return window.location.reload();
      }
    } catch (error: any) {
      setMessageError(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if(messageError) {
      toastError({ message: messageError });
      setLoading(false)
    }
  }, [messageError, loading]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <form
        onSubmit={handleDeleteDudi}
        className="w-full flex flex-col gap-[30px]"
      >
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Apakah anda yakin ingin menghapus User ini?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => setLoading(true)} type="submit">
            {loading && <Spinner />} Delete
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
