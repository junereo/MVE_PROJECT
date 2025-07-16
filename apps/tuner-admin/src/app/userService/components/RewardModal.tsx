'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface RewardModalProps {
    isOpen: boolean;
    userNickname: string;
    defaultAmount?: number;
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

export default function RewardModal({
    isOpen,
    userNickname,
    defaultAmount,
    onClose,
    onConfirm,
}: RewardModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [amount, setAmount] = useState<number | ''>('');

    // 모달 외부 클릭 시 닫기
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            handleClose();
        }
    };
    // 닫기 시 상태 초기화 포함
    const handleClose = useCallback(() => {
        setAmount('');
        onClose();
    }, [onClose]);

    // ESC 누르면 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleClose, isOpen]);
    useEffect(() => {
        setAmount(defaultAmount ?? 0);
    }, [defaultAmount]);
    const handleConfirm = () => {
        if (typeof amount === 'number' && amount > 0) {
            onConfirm(amount);
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        >
            <div className="bg-white p-6 rounded-md shadow-md w-[320px] animate-fadeIn">
                <h2 className="text-lg font-semibold mb-4 text-black">
                    {userNickname} 님에게 리워드 지급
                </h2>
                <label className="text-sm text-gray-600">
                    지급할 리워드 수량
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                            setAmount('');
                        } else {
                            const parsed = parseInt(val);
                            if (!isNaN(parsed)) {
                                setAmount(parsed);
                            }
                        }
                    }}
                    placeholder="0"
                    min={1}
                    className="w-full mt-1 mb-4 px-3 py-2 border rounded text-sm"
                />
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                        onClick={handleClose}
                    >
                        취소
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                        onClick={handleConfirm}
                    >
                        지급
                    </button>
                </div>
            </div>
        </div>
    );
}
