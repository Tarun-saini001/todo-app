"use client"

import { loginUser } from "@/app/actions/auth.actions";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema } from "@/app/validations/auth.user";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";


type LoginState = {
    success: boolean;
    message: string;
    errors?: {
        userName?: string[];
        password?: string[];
    };
};


const initialState = {
    success: false,
    message: "",
    errors: {
        userName: undefined,
        password: undefined,

    },
};

export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const [state, formAction] = useActionState<LoginState, FormData>(loginUser, initialState);
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
    });

    const [blurErrors, setBlurErrors] = useState<{
        userName?: string[];
        password?: string[];
    }>({});


    useEffect(() => {
        const saved = localStorage.getItem("loginForm");
        if (saved) {
            setFormData(JSON.parse(saved));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem("loginForm", JSON.stringify(formData));
    }, [formData]);
    useEffect(() => {
        if (state.success) {
            localStorage.removeItem("loginForm");
        }
    }, [state.success]);

    useEffect(() => {
        if (state.success) {
            toast.success("Login successful", {
                id: "login-success"
            });
            router.push("/");
        }

        if (!state.success && state.message) {
            toast.error(state.message, {
                id: "login-failed"
            });
        }
    }, [state]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const fieldName = e.target.name;
        const value = e.target.value;

        const result = loginSchema.safeParse({
            ...formData,
            [fieldName]: value,
        });

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;

            setBlurErrors((prev) => ({
                ...prev,
                [fieldName]: errors[fieldName as keyof typeof errors],
            }));
        } else {
            setBlurErrors((prev) => ({
                ...prev,
                [fieldName]: undefined,
            }));
        }
    };

    return (

        <form action={formAction} className="space-y-4">

            {/* user name */}
            <div className="relative">
                <img
                    src="./icons/userName.png"
                    alt="user"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                />
                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Username"
                    className="w-full h-10 border rounded-md pl-10 pr-3 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-[#FF6767]"
                />
                {(blurErrors.userName || state.errors?.userName) && (
                    <p className="text-red-500 text-xs mt-1">
                        {blurErrors.userName?.[0] || state.errors?.userName?.[0]}
                    </p>
                )}
            </div>

            {/* password */}
            <div className="relative">
                <img
                    src="./icons/password.png"
                    alt="password icon"
                    className="absolute left-3 top-2.5 w-4 h-4 opacity-70"
                />

                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Password"
                    className="w-full h-10 border pl-10 pr-10 rounded-md p-2 outline-none focus:ring-2 focus:ring-[#FF6767]"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-black"
                >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
                {(blurErrors.password || state.errors?.password) && (
                    <p className="text-red-500 text-xs mt-1">
                        {blurErrors.password?.[0] || state.errors?.password?.[0]}
                    </p>
                )}
            </div>

            {state.message && (
                <p className="text-red-500 text-sm">{state.message}</p>
            )}
            <button
                type="submit"
                className="bg-[#FF6767] cursor-pointer text-white px-6 py-2 rounded-md hover:opacity-90 w-fit"
            >
                Login
            </button>
        </form>
    )
}