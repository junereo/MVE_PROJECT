import Wrapper from "@/components/layouts/Wrapper";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Wrapper>{children}</Wrapper>
    </>
  );
}
