import BottomNavbar from "@/components/layouts/BottomNavbar";
import Wrapper from "@/components/layouts/Wrapper";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Wrapper>{children}</Wrapper>
      <BottomNavbar />
    </>
  );
}
