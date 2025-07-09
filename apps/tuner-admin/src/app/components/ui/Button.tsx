interface ButtonProps {
    color: 'blue' | 'yellow';
    children: React.ReactNode;
    type?: 'submit' | 'button';
    onClick?: () => void;
}

const Button = ({ color, children, type = 'button', onClick }: ButtonProps) => {
    const styles = {
        blue: 'bg-blue-500 hover:bg-blue-600 text-white',
        yellow: 'bg-yellow-400 hover:bg-yellow-500 text-black',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-[100px] py-2 rounded-md font-semibold ${styles[color]}`}
        >
            {children}
        </button>
    );
};

export default Button;
