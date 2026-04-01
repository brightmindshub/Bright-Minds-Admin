"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminAdmissionForm from "@/components/RegistrationForm";

export default function AdmissionPage() {
  const [auth, setAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/login");
    } else {
      setAuth(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    router.push("/login");
  };

  if (!auth) return <div className="h-screen w-full bg-[#19125e] flex items-center justify-center text-white font-black">Verifying...</div>;

  return (
    <AdminAdmissionForm onLogout={handleLogout} />
  );
}