'use client';

import { useEffect, useState, useRef } from 'react';
import { useSessionStore } from '@/store/authmeStore';
import { usePathname } from 'next/navigation';
import { useOauth } from '@/store/globalStore';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { LogOut } from '@/lib/network/api';

export default function Header() {
    const { logout } = useSessionStore();
    const { role, name, reset } = useOauth();
    console.log(role, name);

    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleLogoutConfirm = () => {
        LogOut();
        logout();
        reset();
        router.push('/login');
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            setShowModal(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowModal(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showModal]);

    const pathname = usePathname();

    useEffect(() => {
        // 페이지 변경시 모달창 종료
        setShowModal(false);
    }, [pathname]);

    return (
        <>
            <div className="fixed top-0 left-[8%] w-[92%] h-[60px] gap-3 bg-white text-white z-40 flex items-center justify-end px-6">
                <div className="flex gap-5">
                    <div className="text-2xl text-green-600">권한:{role}</div>
                    <div className="text-2xl text-green-600">닉네임:{name}</div>
                </div>
                <Button color="blue" onClick={() => setShowModal(true)}>
                    LogOut
                </Button>
            </div>

            {showModal && (
                <div
                    ref={modalRef}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300"
                    onClick={handleOverlayClick}
                >
                    <div className="bg-white p-6 rounded-md shadow-md w-[320px] animate-fadeIn">
                        <h2 className="text-lg font-semibold mb-4 text-black">
                            정말 로그아웃 하시겠습니까?
                        </h2>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                                onClick={() => setShowModal(false)}
                            >
                                아니오
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition"
                                onClick={handleLogoutConfirm}
                                autoFocus
                            >
                                예
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
