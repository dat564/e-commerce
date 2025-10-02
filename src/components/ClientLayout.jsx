"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Don't render Header and Footer for admin routes
  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        {children}
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="min-h-[600px] pb-8">{children}</main>
      <Footer />
    </>
  );
}
