import LoginForm from "./components/LoginForm";
import KakaoLoginButton from "./components/KakaoLoginButton";

export default function auth() {
  return (
    <div>
      <h1>LOGIN</h1>
      <div className="flex justify-center font-bold text-2xl pt-1 pb-1">
        LOGO
      </div>
      <div className="max-w-[350px] w-full mx-auto mt-10 mb-10">
        <LoginForm />
        <KakaoLoginButton />
      </div>
    </div>
  );
}
