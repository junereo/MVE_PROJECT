import "./globals.css";
import AuthInitializer from "@/features/auth/components/AuthInitializer";
import QueryClientProvider from "@/lib/react-query/QueryClientProvider";

import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"], // 보통 latin + korean은 자동 포함됨
  weight: ["400", "500", "700"], // 원하는 굵기
  display: "swap", // 웹폰트 로딩 전략
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={notoSansKr.className}>
        <QueryClientProvider>
          <AuthInitializer />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
