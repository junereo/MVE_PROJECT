"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// 동적으로 CSR 전용 컴포넌트 로딩
const SurveyResponsesClient = dynamic(
  () => import("./components/SurveyResponsesClient"),
  {
    ssr: false,
  }
);

export default function SurveyCreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyResponsesClient />
    </Suspense>
  );
}
