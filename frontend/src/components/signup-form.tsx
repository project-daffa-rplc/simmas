import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { api } from "@/lib/api/helper"
import { Navigate } from "react-router-dom"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [namaLengkap, setNamaLengkap] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nis, setNis] = useState('')
  const [kelas, setKelas] = useState('')
  const [jurusan, setJurusan] = useState('')
  const [alamat, setAlamat] = useState('')
  const [telepon, setTelepon] = useState('')
  // const [message, setMessage] = useState('')

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const res = await api.post('/register', {
          name: namaLengkap,
          email: email,
          nis: nis,
          password: password,
          kelas: kelas,
          jurusan: jurusan,
          alamat: alamat,
          telepon: telepon
        })
        
        if(res?.status === 200) {
          return <Navigate to={"/login"}/>
        }
        console.log(res)
    } catch (error:any) {
      console.log(error)
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center flex flex-col">
          <CardTitle className="text-[26px] font-bold">Daftar Sebagai Siswa</CardTitle>
          <CardDescription className="text-[16px] text-(--secondary-foreground)">
            daftarkan dirimu untuk magang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
                <Input id="name" type="text" placeholder="Masukan Nama Lengkap Anda" onChange={(e) => setNamaLengkap(e.target.value)} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukan Email Anda"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="NIS">NIS</FieldLabel>
                <Input
                  id="NIS"
                  type="number"
                  placeholder="Masukan NIS Anda"
                  onChange={(e) => setNis(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" placeholder="Masukan Password" onChange={(e) => setPassword(e.target.value)} required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </Field>
                <FieldDescription>
                  Password harus lebih dari 8 kata.
                </FieldDescription>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="kelas">Kelas</FieldLabel>
                    <Input id="kelas" type="text" placeholder="Masukan Kelas" onChange={(e) => setKelas(e.target.value)} required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="jurusan">
                      Jurusan
                    </FieldLabel>
                    <Input id="jurusan" type="text" placeholder="Masukan jurusan" onChange={(e) => setJurusan(e.target.value)} required />
                  </Field>
                </Field>
                <FieldDescription>
                  Nama kelas dan Jurusan harus besar semua!
                </FieldDescription>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="alamat">Alamat</FieldLabel>
                    <Input id="alamat" type="text" placeholder="Masukan alamat" onChange={(e) => setAlamat(e.target.value)} required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="telepon">
                      Telepon
                    </FieldLabel>
                    <Input id="telepon" type="text" placeholder="Masukan telepon" onChange={(e) => setTelepon(e.target.value)} required />
                  </Field>
                </Field>
              </Field>
              <Field>
                <Button type="submit">Buat Akun</Button>
                <FieldDescription className="text-center">
                  Sudah punya akun? <a href="/login">Login</a>
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
  )
}
