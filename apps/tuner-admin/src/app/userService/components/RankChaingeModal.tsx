'use client';

import { useEffect, useRef } from 'react';

export interface RankChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userNickname: string;
}

const RankChangeModal = ({
    isOpen,
    onClose,
    onConfirm,
    userNickname,
}: RankChangeModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            onClose();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-6 rounded-md shadow-md w-[360px] animate-fadeIn">
                <h2 className="text-lg font-semibold mb-4 text-black">
                    등급 변경
                </h2>
                <p className="mb-4 text-gray-700">
                    <strong className="text-blue-600">{userNickname}</strong>
                    님을 <strong className="text-green-600">Expert 등급</strong>
                    으로 변경하시겠습니까?
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition"
                        onClick={onConfirm}
                        autoFocus
                    >
                        변경하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RankChangeModal;
