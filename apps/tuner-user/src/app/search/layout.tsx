import SearchHeader from "@/components/layouts/SearchHeader";
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
      <SearchHeader />
      <PageWrapper>{children}</PageWrapper>
      <BottomNavbar />
      <Footer />
    </>
  );
}
