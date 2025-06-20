import { Suspense } from "react";
import GoogleRedirectClient from "./components/GoogleRedirectClient";

export default function GoogleRedirectPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">로딩 중입니다...</p>}>
      <GoogleRedirectClient />
    </Suspense>
  );
}
