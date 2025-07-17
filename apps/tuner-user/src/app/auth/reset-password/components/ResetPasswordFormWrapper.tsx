"use client";

import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordFormWrapper() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
