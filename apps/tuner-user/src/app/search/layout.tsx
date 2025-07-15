import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import BottomNavbar from "@/components/layouts/BottomNavbar";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <PageWrapper>{children}</PageWrapper>
      <BottomNavbar />
      <Footer />
    </>
  );
}
