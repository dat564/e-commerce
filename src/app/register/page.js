import { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Đăng ký - M.O.B",
  description: "Đăng ký tài khoản mới tại M.O.B",
};

export default function RegisterPage() {
  return (
    <PageTransition>
      <Suspense
        fallback={
          <div className="min-h-[600px] flex items-center justify-center">
            Đang tải...
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </PageTransition>
  );
}
