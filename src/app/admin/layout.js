import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Dashboard - M.O.B",
  description: "Trang quản trị hệ thống M.O.B",
};

export default function AdminRootLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
