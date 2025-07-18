import type { UseFormRegister, RegisterOptions } from "react-hook-form";

interface InputProps {
    type: string;
    name: string;
    placeholder: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions
}

export function Input({ type, name, placeholder, error, register, rules }: InputProps) {
    return (
        <div>
            <input 
                className="w-full border-2 border-slate-200 rounded-md h-11 px-2 outline-none"
                placeholder={placeholder}
                type={type} 
                {...register(name, rules)}
                id={name}
            />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}