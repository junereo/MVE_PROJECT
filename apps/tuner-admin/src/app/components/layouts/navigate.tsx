import Link from 'next/link';

// src/components/Navigate.tsx
export default function Navigate() {
    return (
        <div className="fixed top-0 left-0 h-screen w-[8%] min-w-[72px] bg-blue-600 text-white shadow-lg z-50">
            <div className="p-4 font-bold text-lg">네비게이션</div>
            <ul className="space-y-2 p-4">
                <li>
                    <Link
                        href="/dashboard"
                        className="block hover:text-blue-300"
                    >
                        - Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/survey" className="block hover:text-blue-300">
                        - Surveys
                    </Link>
                </li>
                <li>
                    <Link href="/signup" className="block hover:text-blue-300">
                        - Sign up
                    </Link>
                </li>
                <li>
                    <Link
                        href="/template"
                        className="block hover:text-blue-300"
                    >
                        - Template
                    </Link>
                </li>
                <li>
                    <Link href="/mypage" className="block hover:text-blue-300">
                        - My Page
                    </Link>
                </li>
                <li>
                    <Link href="/wallet" className="block hover:text-blue-300">
                        - wallet
                    </Link>
                </li>
            </ul>
        </div>
    );
}
