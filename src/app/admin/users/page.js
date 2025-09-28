import UserManagement from "@/components/admin/UserManagement";

export const metadata = {
  title: "Quản lý tài khoản - M.O.B Admin",
  description: "Quản lý người dùng hệ thống M.O.B",
};

export default function AdminUsersPage() {
  return <UserManagement />;
}
