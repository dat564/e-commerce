import LoginForm from "@/components/LoginForm";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Đăng nhập - M.O.B",
  description: "Đăng nhập vào tài khoản M.O.B",
};

export default function LoginPage() {
  return (
    <PageTransition>
      <LoginForm />
    </PageTransition>
  );
}
