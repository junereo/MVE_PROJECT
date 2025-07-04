export default function SurveyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pt-[80px] pb-[80px] w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto px-4">
      {children}
    </main>
  );
}
