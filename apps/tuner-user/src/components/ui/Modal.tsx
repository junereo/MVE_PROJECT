"use client";

import Image from "next/image";
import { useEffect } from "react";

interface ModalProps {
  image: string;
  userNickname?: string;
  description: string;
  buttonLabel: string;
  color: "blue" | "red";
  onClick: () => void;
  onClose: () => void;
}

export default function Modal({
  image,
  userNickname,
  description,
  buttonLabel,
  color,
  onClick,
  onClose,
}: ModalProps) {
  const styles = {
    blue: " bg-blue-500 hover:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600",
  };

  useEffect(() => {
    document.body.style.overflow = "hidden"; // 모달창 뜨면 배경 스크롤 막음
    return () => {
      document.body.style.overflow = "auto"; // 모달창 닫히면 스크롤 원래대로
    };
  }, []);

  //   모달 외부 클릭 시 모달 닫힘
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClose();
  };

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        onClick={stopPropagation}
        className="bg-white w-[90%] max-w-sm rounded-xl px-6 py-10 text-center relative shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
        >
          X
        </button>
        <div className="flex justify-center mb-8">
          <Image
            src={`/images/${image}`}
            alt="modal image"
            width={70}
            height={70}
          />
        </div>

        {userNickname && (
          <div className="text-lg font-semibold text-gray-800 mb-1">
            {userNickname}
          </div>
        )}
        <div className="text-base text-gray-600 mb-8">{description}</div>

        <button
          onClick={onClick}
          className={`w-full py-3 ${styles[color]} text-white font-bold rounded-lg transition duration-200`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
