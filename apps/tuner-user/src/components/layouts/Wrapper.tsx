"use client";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-[60px] pb-[80px] w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto px-4 min-h-screen">
      {children}
    </main>
  );
}
