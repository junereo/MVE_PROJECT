"use client";

import { useEffect, useRef } from "react";

export interface ReusableModalProps {
  isOpen: boolean;
  title: string;
  content?: string | React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ReusableModal = ({
  isOpen,
  title,
  content,
  onClose,
  onConfirm,
  confirmText = "예",
  cancelText = "아니오",
}: ReusableModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-md shadow-md w-[320px] animate-fadeIn">
        <h2 className="text-lg font-semibold mb-4 text-black">{title}</h2>
        {content && <div className="mb-4 text-gray-700">{content}</div>}
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition"
            onClick={onConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableModal;
