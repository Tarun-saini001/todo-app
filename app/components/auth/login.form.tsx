"use client"

import { loginUser } from "@/app/actions/auth.actions";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/app/validations/auth.user";
import toast from "react-hot-toast";
import { LoginState } from "../../types/auth.types";
import FormInput from "../ui/FormInput";




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
    // const [showPassword, setShowPassword] = useState(false);

    const [state, formAction] = useActionState<LoginState, FormData>(loginUser, initialState);
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
    });

    const [blurErrors, setBlurErrors] = useState<{
        userName?: string[];
        password?: string[];
    }>({});
    const [serverMessage, setServerMessage] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("loginForm");
        if (saved) {
            setFormData(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {

        if (state.success) {
            localStorage.removeItem("loginForm");
            return;
        } else {
            localStorage.setItem("registerForm", JSON.stringify(formData));
        }

    }, [formData, state.success]);

    useEffect(() => {
        if (state.success) {
            toast.success("Login successful", {
                id: "login-success"
            });
            router.push("/");
        }

        if (!state.success && state.message) {
            setServerMessage(state.message);
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
        setBlurErrors((prev) => ({
            ...prev,
            [e.target.name]: "",
        }));
        setServerMessage("");
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
            <FormInput
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Username"
                icon="/icons/userName.png"
                error={blurErrors.userName?.[0] || state.errors?.userName?.[0]}
            />


            <FormInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Password"
                icon="/icons/password.png"
                isPassword
                error={blurErrors.password?.[0] || state.errors?.password?.[0]}
            />


            {serverMessage && (
                <p className="text-red-500 text-sm">{serverMessage}</p>
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