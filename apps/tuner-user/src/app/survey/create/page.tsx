import dynamic from "next/dynamic";
import { Suspense } from "react";

// 동적으로 CSR 전용 컴포넌트 로딩
const SurveyCreateClient = dynamic(
  () => import("./components/SurveyCreateClient"),
  {
    ssr: false,
  }
);

export default function SurveyCreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyCreateClient />
    </Suspense>
  );
}
