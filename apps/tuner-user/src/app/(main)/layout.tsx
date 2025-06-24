import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import BottomNavbar from "@/components/layouts/BottomNavbar";
import Wrapper from "@/components/layouts/Wrapper";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <Wrapper>{children}</Wrapper>
        <BottomNavbar />
        <Footer />
      </body>
    </html>
  );
}
