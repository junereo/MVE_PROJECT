import { InputHTMLAttributes } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
    color?: 'white' | 'black';
    label?: string;
    name: string;
}

const Radio = ({ color = 'white', label, ...rest }: RadioProps) => {
    const radioColorVariants = {
        white: 'bg-white border-gray-300',
        black: 'bg-black border-gray-800',
    };

    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm text-gray-600">{label}</label>}
            <input
                type="radio"
                className={`w-4 h-4 ${radioColorVariants[color]} rounded-full focus:ring-2 focus:ring-blue-500`}
                {...rest}
            />
        </div>
    );
};

export default Radio;
