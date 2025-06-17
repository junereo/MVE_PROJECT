import Link from 'next/link';

// src/components/Navigate.tsx
export default function Navigate() {
    return (
        <div className="fixed top-0 left-0 h-screen w-[8%] bg-gray-600 text-white shadow-lg z-50">
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
                    <Link href="/singup" className="block hover:text-blue-300">
                        - Sing up
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
            </ul>
        </div>
    );
}
