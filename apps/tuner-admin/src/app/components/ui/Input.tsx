import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    color?: 'white' | 'black';
    label?: string;
    type?: 'text' | 'textarea';
    id?: string;
}

export default function Input({ label, type, id }: InputProps) {
    return (
        <div className="flex flex-col">
            {label && (
                <label htmlFor={id} className="text-sm text-gray-600">
                    {label}
                </label>
            )}
            <input type={type} id={id} />
        </div>
    );
}
