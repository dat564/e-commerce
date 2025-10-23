import { Suspense } from "react";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Quên mật khẩu - M.O.B",
  description: "Đặt lại mật khẩu tài khoản M.O.B",
};

export default function ForgotPasswordPage() {
  return (
    <PageTransition>
      <Suspense
        fallback={
          <div className="min-h-[600px] flex items-center justify-center">
            Đang tải...
          </div>
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </PageTransition>
  );
}

