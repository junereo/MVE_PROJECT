import "./globals.css";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import Sidebar from "../components/layouts/sidebar";
import Wrapper from "../components/layouts/Wrapper";
import AuthInitializer from "@/features/auth/components/AuthInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Wrapper>
          <AuthInitializer />
          {children}
        </Wrapper>
        <Sidebar />
        <Footer />
      </body>
    </html>
  );
}
