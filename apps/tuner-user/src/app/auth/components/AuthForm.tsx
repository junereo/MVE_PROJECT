interface AuthFormProps {
  title: string;
  onSubmit: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthForm({
  title,
  onSubmit,
  children,
  footer,
}: AuthFormProps) {
  return (
    <div className="w-full max-w-[400px] mx-auto mt-12">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className="text-gray-400 text-sm mt-2">
          Tuner 서비스에 오신 걸 환영합니다
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg"
      >
        {children}
        {footer && <div className="mt-4 text-sm text-center">{footer}</div>}
      </form>
    </div>
  );
}
