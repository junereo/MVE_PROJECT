interface ButtonProps {
  color: "blue" | "yellow" | "white" | "red";
  children: React.ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  color,
  children,
  type = "button",
  onClick,
  disabled = false,
}: ButtonProps) => {
  const styles = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    yellow: "bg-yellow-400 hover:bg-yellow-500 text-black",
    white: "border border-gray-100 hover:bg-gray-100 text-black",
    red: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 rounded-md font-semibold ${styles[color]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
