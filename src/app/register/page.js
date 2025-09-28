import RegisterForm from "@/components/RegisterForm";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Đăng ký - M.O.B",
  description: "Đăng ký tài khoản mới tại M.O.B",
};

export default function RegisterPage() {
  return (
    <PageTransition>
      <RegisterForm />
    </PageTransition>
  );
}
