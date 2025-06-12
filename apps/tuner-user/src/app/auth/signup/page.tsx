import AuthForm from "../components/AuthForm";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";

export default function Signup() {
  return (
    <div>
      <h1 className="title">SIGNUP</h1>
      <div className="flex justify-center font-bold text-2xl pt-1 pb-1">
        LOGO
      </div>
      <AuthForm title="회원가입" /*onSubmit={() => {}}*/>
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex flex-col gap-2 mb-4">
            <Input type="email" placeholder="이메일을 입력해주세요" />
            <Input type="password" placeholder="비밀번호를 입력해주세요" />
            <Input type="password" placeholder="비밀번호를 다시 입력해주세요" />
          </div>
          <Input type="text" placeholder="닉네임을 입력해주세요" />
          <Input
            type="tel"
            placeholder="휴대전화번호를 입력해주세요"
            maxLength={11}
          />
        </div>
        <Button color="blue">회원가입</Button>
      </AuthForm>
    </div>
  );
}
