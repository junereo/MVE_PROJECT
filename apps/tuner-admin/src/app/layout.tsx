import Navigate from "./components/layouts/navigate";
import SessionChecker from "./components/SessionChecRer";
import "./globals.css";
import Providers from "./provider";
import Header from "./components/layouts/header";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="overflow-y-scroll flex">
        <Providers>
          <Navigate />
          <Header />
          <SessionChecker />
          <div className="w-full min-h-screen h-full  m-auto pt-[63px] pl-5 bg-[#DEDEDE] ">
            <div className="ml-[72px] lg:ml-[6%] w-[93%]">
              <div className="w-full min-h-screen h-full p-6 border  shadow rounded-lg bg-[#EBEBEB]">
                {children}
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
