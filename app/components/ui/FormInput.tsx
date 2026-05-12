"use client";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

type FormInputProps = {
    name: string;
    type?: string;
    value: string;
    placeholder?: string;
    icon: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    isPassword?: boolean;
};

export default function FormInput({
    name,
    type = "text",
    value,
    placeholder,
    icon,
    error,
    onChange,
    onBlur,
    isPassword = false,
}: FormInputProps) {
    const [show, setShow] = useState(false);

    const inputType = isPassword ? (show ? "text" : "password") : type;

    return (
        <div className="relative">
            <img
                src={icon}
                alt={name}
                className="absolute left-3 top-3 w-4 h-4 opacity-70"
            />

            <input
                type={inputType}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className="w-full h-10 cursor-pointer border pl-10 pr-10 rounded-md p-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#FF6767]"
            />

            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShow((prev) => !prev)}
                    className="absolute cursor-pointer right-3 top-3 text-gray-500 hover:text-black"
                >
                    {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
            )}

            {error && (
                <p className="text-red-500 text-xs mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}