import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Đăng nhập - M.O.B",
  description: "Đăng nhập vào tài khoản M.O.B",
};

export default function LoginPage() {
  return (
    <PageTransition>
      <Suspense
        fallback={
          <div className="min-h-[600px] flex items-center justify-center">
            Đang tải...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </PageTransition>
  );
}
