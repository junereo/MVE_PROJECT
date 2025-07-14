"use client";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pt-[80px] pb-[100px] w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto px-4 min-h-[calc(100dvh-180px)]">
      {children}
    </main>
  );
}
