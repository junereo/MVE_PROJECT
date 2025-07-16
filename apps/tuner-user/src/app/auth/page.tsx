import LoginForm from "./components/LoginForm";
import KakaoLoginButton from "./components/KakaoLoginButton";
import GoogleLoginButton from "./components/GoogleLoginButton";
import Image from "next/image";
import Link from "next/link";

export default function Auth() {
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
      <div className="max-w-[350px] w-full mx-auto mt-10 mb-10">
        <LoginForm />
        <div className="flex flex-col gap-3">
          <GoogleLoginButton />
          <KakaoLoginButton />
        </div>
      </div>
    </div>
  );
}
