import ProfileContent from "@/components/profile/ProfileContent";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Thông tin tài khoản - M.O.B",
  description: "Quản lý thông tin tài khoản cá nhân",
};

export default function ProfilePage() {
  return (
    <PageTransition>
      <ProfileContent />
    </PageTransition>
  );
}
