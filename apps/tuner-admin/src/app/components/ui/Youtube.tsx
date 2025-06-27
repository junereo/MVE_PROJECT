"use client";
import { useRouter } from "next/navigation";
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const YoutubeBtn = ({ children, onClick, ...rest }: ButtonProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    router.push("/survey/search"); // ← 경로 앞에 `/` 빼먹지 않게 주의!
  };

  return (
    <button
      onClick={handleClick}
      {...rest}
      className={`w-[200px] h-[100px] border border-dashed py-2 text-white bg-black rounded-md font-semibold opacity-45`}
    >
      {children}
    </button>
  );
};

export default YoutubeBtn;
