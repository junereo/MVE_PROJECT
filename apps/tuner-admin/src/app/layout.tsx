import Navigate from './components/layouts/navigate'
import SessionChecker from './components/SessionChecRer'
import './globals.css'
import Providers from './provider'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: '제목입니다',
  description: 'layout.tsx는 서버 컴포넌트. client hook 사용 ❌',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Navigate />
          <SessionChecker />
          {children}
        </Providers>
      </body>
    </html>
  )
}
