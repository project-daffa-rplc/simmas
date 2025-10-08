import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type React from "react";
import { useEffect, useState } from "react";
import {
  api,
  currentRole,
  currentToken,
  nameUser,
  toastError,
  toastSuccess,
} from "@/lib/api/helper";
import { Navigate } from "react-router-dom";
import { Spinner } from "./ui/spinner";
import { Toaster } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  interface LoginResponse {
    message: string;
    access_token: string;
    role: string;
    user: {
      name: string;
    };
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(!loading);
      const res = await api.post<LoginResponse>("/login", {
        email: email,
        password: password,
      });
      const data = res.data;
      console.log(data);
      currentRole.set(data.role);
      nameUser.set(data?.user?.name);
      currentToken.set(data.access_token);

      if (res?.status === 200) {
        setLoading(!loading);
        toastSuccess({ title: "Login Berhasil" });
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch (error: any) {
      setLoading(false);
      if (error?.status === 401) {
        setMessage(error.response.data.message);
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (message) {
      toastError({message: message})
    }
  }, [message]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster position="top-center" duration={2000} className="z-[100]" />
      <Card>
        <CardHeader className="text-center flex flex-col">
          <CardTitle className="text-[26px] font-bold">
            Selamat Datang
          </CardTitle>
          <CardDescription className="text-[16px] text-(--secondary-foreground)">
            Login ke akun anda, sekarang!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukan email anda"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  placeholder="Masukan password anda"
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit">{loading ? <Spinner /> : ("Login")}</Button>
                <FieldDescription className="text-center">
                  Belum punya akun? <a href="/register">Register</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
