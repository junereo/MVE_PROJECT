"use client";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen pt-[80px] pb-[100px] w-full max-w-[768px] mx-auto px-4">
      {children}
    </main>
  );
}
