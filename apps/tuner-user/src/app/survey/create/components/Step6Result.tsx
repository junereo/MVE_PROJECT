"use client";

import Link from "next/link";

interface Step6Props {
  onPrev: () => void;
}

export default function Step6Result({ onPrev }: Step6Props) {
  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </header>

      <div className="min-h-screen flex justify-center px-4">
        <div className="bg-white w-full max-w-[485px] py-10 text-center flex flex-col justify-center items-center gap-10">
          <div>
            <img
              src="/images/check.png"
              alt="성공"
              className="w-[64px] h-[64px] object-contain"
            />
          </div>

          <div className="text-xl font-bold text-gray-800">
            <p>설문 생성 완료</p>
            <p className="text-base text-gray-600 mt-2">
              설문이 성공적으로 생성되었습니다.
            </p>
          </div>

          <Link
            href="/survey"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-center font-bold rounded-lg transition duration-200"
          >
            확인
          </Link>
        </div>
      </div>
    </>
  );
}
