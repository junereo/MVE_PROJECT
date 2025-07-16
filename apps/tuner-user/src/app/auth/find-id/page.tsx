"use client";

import Image from "next/image";
import Link from "next/link";
import FindIdForm from "./components/FindIdForm";

export default function FindId() {
  return (
    <div className="sm:pt-[150px]">
      <Link href="/" className="flex items-center justify-center">
        <Image
          src="/images/logo.png"
          alt="로고 이미지"
          width={100}
          height={24}
        />
      </Link>
      <div className="flex flex-col gap-16 max-w-[350px] w-full mx-auto mt-10 mb-10">
        <div className="text-center space-y-2">
          <h1 className="text-[22px] sm:text-2xl font-bold text-gray-900">
            이메일 찾기
          </h1>
          <p className="text-sm text-gray-500">
            가입 시 입력한 휴대폰 번호로 이메일을 찾을 수 있어요
          </p>
        </div>
        <FindIdForm />
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="text-sm text-gray-500 border-r border-gray-300 pr-3 cursor-pointer"
          >
            TUNER
          </Link>
          <p className="text-sm text-gray-500 cursor-pointer">
            회원정보 고객센터
          </p>
        </div>
      </div>
    </div>
  );
}
