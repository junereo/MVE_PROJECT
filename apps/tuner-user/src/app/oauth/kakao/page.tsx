import { Suspense } from "react";
import KakaoRedirectClient from "./components/KakaoRedirectClient";

export default function KakaoRedirectPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">로딩 중입니다...</p>}>
      <KakaoRedirectClient />
    </Suspense>
  );
}
