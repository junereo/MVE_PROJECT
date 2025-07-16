"use client";

import Image from "next/image";
import Link from "next/link";
import ResetPasswordForm from "./components/ResetPasswordForm";

export default function ResetPassword() {
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
            비밀번호 재설정
          </h1>
          <p className="text-sm text-gray-500">비밀번호를 재설정 해주세요</p>
        </div>
        <ResetPasswordForm />
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
