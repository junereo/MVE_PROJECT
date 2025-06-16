"use client";

import Image from "next/image";

interface ModalProps {
  image: string;
  userNickname?: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}

export default function Modal({
  image,
  userNickname,
  description,
  buttonLabel,
  onClick,
}: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[90%] max-w-sm rounded-xl px-6 py-10 text-center relative shadow-lg">
        <div className="flex justify-center mb-6">
          <Image
            src={`/images/${image}`}
            alt="modal image"
            width={60}
            height={60}
          />
        </div>
        <div className="text-lg font-semibold text-gray-800 mb-1">
          {userNickname}
        </div>
        <div className="text-base text-gray-600 mb-6">{description}</div>
        <button
          onClick={onClick}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-200"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
