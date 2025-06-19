"use client";

import Button from "@/components/ui/Button";

export default function GoogleLoginButton() {
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;

  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div>
      <Button onClick={handleLogin} color="white">
        구글 로그인
      </Button>
    </div>
  );
}
