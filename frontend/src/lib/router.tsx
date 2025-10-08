import { BrowserRouter, Routes, Route } from "react-router-dom";
import BaseLayout from "../components/Layouts/BaseLayout";
import DashboardPage from "../app/Admin/dashboard/page";
import { currentRole } from "./api/helper";
import AuthLayout from "../components/Layouts/AuthLayout";
import { LoginForm } from "../components/login-form";
import { SignupForm } from "../components/signup-form";
import DudiAdmin from "@/app/Admin/dudi/page";
import ManagementUserAdmin from "@/app/Admin/management-user/page";
import SeetingSekolah from "@/app/Admin/setting-sekolah/page";
import DashboardGuru from "@/app/Guru/dashboard/page";
import DudiGuru from "@/app/Guru/dudi/page";
import MagangGuru from "@/app/Guru/magang/page";

export default function RouterWithRole() {
  const role = currentRole.get();

  if (role === "admin") {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            element={<AuthLayout />}
            children={[
              <Route path="/login" element={<LoginForm />} />,
              <Route path="/register" element={<SignupForm />} />,
            ]}
          />
          <Route
            element={<BaseLayout />}
            children={[
              <Route index element={<DashboardPage />} path="/" />,
              <Route element={<DudiAdmin />} path="/dudi" />,
              <Route
                element={<ManagementUserAdmin />}
                path="/management-user"
              />,
              <Route element={<SeetingSekolah />} path="/setting" />,
            ]}
          />
        </Routes>
      </BrowserRouter>
    );
  } else if (role === "guru") {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            element={<AuthLayout />}
            children={[<Route path="/login" element={<LoginForm />} />]}
          />
          <Route
            element={<BaseLayout />}
            children={[
              <Route index element={<DashboardGuru />} path="/" />,
              <Route element={<DudiGuru />} path="/dudi" />,
              <Route element={<MagangGuru />} path="/magang" />,
            ]}
          />
        </Routes>
      </BrowserRouter>
    );
  }
}
