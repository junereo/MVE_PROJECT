"use client";

import Button from "@/components/ui/Button";

export default function GoogleLoginButton() {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;


  const handleLogin = () => {
    window.location.href = googleLoginUrl;
  };

  return (
    <div>

      <Button onClick={handleLogin} color="white" >

        구글 로그인
      </Button>
    </div>
  );
}
