import "./globals.css";
import AuthInitializer from "@/features/auth/components/AuthInitializer";
import QueryClientProvider from "@/lib/react-query/QueryClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryClientProvider>
          <AuthInitializer />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
