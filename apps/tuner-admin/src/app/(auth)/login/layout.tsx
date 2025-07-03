export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#DEDEDE] flex items-center justify-center">
      <div className="w-full max-w-xl px-4">{children}</div>
    </div>
  );
}
