import { Suspense } from "react";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Đặt lại mật khẩu - M.O.B",
  description: "Đặt lại mật khẩu tài khoản M.O.B",
};

export default function ResetPasswordPage() {
  return (
    <PageTransition>
      <Suspense
        fallback={
          <div className="min-h-[600px] flex items-center justify-center">
            Đang tải...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </PageTransition>
  );
}

