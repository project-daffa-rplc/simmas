import { Value } from "@radix-ui/react-select";
import axios from "axios";
import { toast } from "sonner";

// get .env
const env = ({ key }: { key: string }) => {
  return import.meta.env[key];
};

// token
export const currentToken = {
  get: () => localStorage.getItem("token"),
  set: (token: string) => localStorage.setItem("token", token),
  clear: () => localStorage.removeItem("token"),
};

// role
export const currentRole = {
  get: () => localStorage.getItem("role"),
  set: (role: string) => localStorage.setItem("role", role),
  clear: () => localStorage.removeItem("role"),
};

// name
export const nameUser = {
  get: () => localStorage.getItem("name"),
  set: (name: string) => localStorage.setItem("name", name),
  clear: () => localStorage.removeItem("name"),
};

// api helper
export const api = axios.create({
  baseURL: env({ key: "VITE_API_URL" }) as string,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${currentToken.get()}`,
  },
});

// status dudi
export const statusDudi = [
  {
    key: "Aktif",
    value: "aktif",
  },
  {
    key: "Pending",
    value: "pending",
  },
  {
    key: "Nonaktif",
    value: "nonaktif",
  },
];

// role
export const admin = 1;
export const guru = 2;
export const siswa = 3;

export const roleSelect = [
  { key: "Admin", value: "admin" },
  { key: "Guru", value: "guru" },
  { key: "Siswa", value: "siswa" },
];

export const verification = [
  { key: "unferivication", value: "unferivication" },
  { key: "verification", value: "verification" },
];

export const toastError = ({ message }: { message: string | undefined }) => {
  return toast.error("Gagal Menghapus User", {
    description: message,
  });
};

export const toastSuccess = ({ title }: { title: string }) => {
  return toast.success(title);
};

export const diterima = "diterima";
export const berlangsung = "berlangsung";
export const selesai = "selesai";
export const pending = "pending";
export const ditolak = "ditolak";
export const dibatalkan = "dibatalkan";

export const statusMagang = [
  {key: "pending", value: "pending" },
  {key: "terima", value: "diterima" },
  {key: "berlangsung", value: "berlangsung" },
  {key: "selesai", value: "selesai" },
  {key: "tolak", value: "ditolak" },
]