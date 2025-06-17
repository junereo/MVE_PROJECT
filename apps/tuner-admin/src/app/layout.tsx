import Navigate from './components/layouts/navigate';
import SessionChecker from './components/SessionChecRer';
import './globals.css';
import Providers from './provider';
import Header from './components/layouts/header';
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className="overflow-y-scroll">
                <Providers>
                    <Navigate />
                    <Header />
                    <SessionChecker />
                    <div className="w-[84%] m-auto pt-[100px]">{children}</div>
                </Providers>
            </body>
        </html>
    );
}
