interface ButtonProps {
  color: "blue" | "yellow";
  children: React.ReactNode;
  type?: "submit" | "button";
}

const Button = ({ color, children, type = "button" }: ButtonProps) => {
  const styles = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    yellow: "bg-yellow-400 hover:bg-yellow-500 text-black",
  };

  return (
    <button
      type={type}
      className={`w-full py-2 rounded-md font-semibold ${styles[color]}`}
    >
      {children}
    </button>
  );
};

export default Button;
