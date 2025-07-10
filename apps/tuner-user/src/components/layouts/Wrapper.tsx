"use client";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen pt-[80px] pb-[100px] w-full sm:max-w-[640px] xs:max-w-[485px] mx-auto px-4">
      {children}
    </main>
  );
}
