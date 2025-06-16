export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-[100px] w-full max-w-[485px] mx-auto px-4 min-h-screen border border-blue-800">
      {children}
    </main>
  );
}
