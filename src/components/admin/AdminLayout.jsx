"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (!user) {
  //       router.push("/login");
  //       return;
  //     }
  //     if (!isAdmin()) {
  //       router.push("/");
  //       return;
  //     }
  //   }
  // }, [user, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // if (!user || !isAdmin()) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
