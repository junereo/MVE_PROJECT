"use client";
import { usePathname } from "next/navigation";
import Navigate from "./components/layouts/navigate";
import SessionChecker from "./components/SessionChecRer";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import Providers from "./provider";
import Header from "./components/layouts/header";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"], // 보통 latin + korean은 자동 포함됨
  weight: ["400", "500", "700"], // 원하는 굵기
  display: "swap", // 웹폰트 로딩 전략
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} overflow-y-scroll flex`}>
        <Providers>
          {!isLoginPage && <Navigate />}
          {!isLoginPage && <Header />}
          {!isLoginPage && <SessionChecker />}

          <main
            className={`w-full min-h-screen h-full ${
              isLoginPage
                ? "bg-[#DEDEDE] flex justify-center items-center"
                : "pt-[63px] pl-[22px] bg-[#DEDEDE]"
            }`}
          >
            <div
              className={
                isLoginPage ? "w-full max-w-xl" : "ml-[72px] lg:ml-[6%] w-[93%]"
              }
            >
              <div
                className={`w-full min-h-screen h-full ${
                  isLoginPage ? "" : "p-6 border shadow rounded-lg bg-[#EBEBEB]"
                }`}
              >
                {children}
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
