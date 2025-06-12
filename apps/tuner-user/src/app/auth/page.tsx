import Link from "next/link";
import AuthForm from "./components/AuthForm";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";

export default function auth() {
  return (
    <div className="content">
      <h1>LOGIN</h1>
      <div className="flex justify-center font-bold text-2xl pt-1 pb-1">
        LOGO
      </div>
      <div className="max-w-[350px] w-full mx-auto mt-10 mb-10">
        <AuthForm
          title="로그인"
          footer={
            <Link href="/auth/signup" className="text-blue-400 hover:underline">
              아직 계정이 없으신가요? 회원가입
            </Link>
          }
          // onSubmit={() => {}}
        >
          <div>
            <Input type="email" placeholder="이메일을 입력해주세요" />
            <Input type="password" placeholder="비밀번호를 입력해주세요" />
          </div>
          <Button color="blue">로그인</Button>
        </AuthForm>
        <form className="flex flex-col gap-4 mb-10 border-b border-gray-300 pb-10"></form>
        <Button color="yellow">카카오 로그인</Button>
      </div>
    </div>
  );
}
