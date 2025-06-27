import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  color?: "white" | "black";
  label?: string;
  type?: "text" | "textarea";
  id?: string;
}

export default function Input({
  label,
  type,
  id,
  color = "white",
  ...rest
}: InputProps) {
  const radioColorVariants = {
    white: "bg-white border-gray-300",
    black: "bg-black border-gray-800",
  };
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="text-sm text-gray-600">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`w-4 h-4 ${radioColorVariants[color]} rounded-full focus`}
        {...rest}
      />
    </div>
  );
}
