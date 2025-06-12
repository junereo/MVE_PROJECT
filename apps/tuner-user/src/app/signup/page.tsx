import Link from "next/link";

export default function Signup() {
  return (
    <div className="content">
      <h1 className="title">SIGNUP</h1>
      <div className="login-container">
        <div>
          <div className="login-form">
            <input type="email" placeholder="이메일을 입력해주세요" />
            <input type="password" placeholder="비밀번호를 입력해주세요" />
            <input type="text" placeholder="닉네임을 입력해주세요" />
            <input
              type="tel"
              placeholder="휴대전화번호를 입력해주세요"
              maxLength={11}
            />
          </div>
          <button>회원가입</button>
        </div>
      </div>
    </div>
  );
}
