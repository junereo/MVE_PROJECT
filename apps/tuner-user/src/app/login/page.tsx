import Link from "next/link";

export default function Login() {
  return (
    <div className="content">
      <h1 className="title">LOGIN</h1>
      <div className="login-container">
        <div>
          <form className="login-form">
            <input type="email" placeholder="이메일을 입력해주세요" />
            <input type="password" placeholder="비밀번호를 입력해주세요" />
            <button type="submit">로그인</button>
          </form>
        </div>
        <button className="kakao">카카오 로그인</button>
        <Link href="/signup">회원가입</Link>
      </div>
    </div>
  );
}
