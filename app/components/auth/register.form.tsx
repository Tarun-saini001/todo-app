"use client";

import { registerUser } from "@/app/actions/auth.actions";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerSchema } from "@/app/validations/auth.user";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RegisterState } from "../../types/auth.types";
import FormInput from "../ui/FormInput";



const initialState: RegisterState = {
    success: false,
    errors: {},
    message: "",
};

export default function RegisterForm() {

    // const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [blurErrors, setBlurErrors] = useState<RegisterState["errors"]>({});
    const router = useRouter();
    const [state, formAction] = useActionState<RegisterState, FormData>(registerUser, initialState);
    const [serverMessage, setServerMessage] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("regirsterForm");
        if (saved) {
            setFormData(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (state.success) {
            localStorage.removeItem("registerForm");
        } else {
            localStorage.setItem("registerForm", JSON.stringify(formData));
        }
    }, [formData, state.success]);

    useEffect(() => {
        if (state.success) {

            setFormData({
                firstName: "",
                lastName: "",
                userName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            router.push("/sign-in");
            return;
        }

        if (state.message) {
            setServerMessage(state.message);
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

        const result = registerSchema.safeParse({
            ...formData,
            [fieldName]: value,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setBlurErrors((prev) => ({
                ...prev,
                [fieldName]: fieldErrors[fieldName as keyof typeof fieldErrors],
            }));
        } else {
            setBlurErrors((prev) => ({
                ...prev,
                [fieldName]: undefined,
            }));
        }
    };

    return (
        <form action={formAction} className="space-y-2 h-auto">

            <FormInput
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter First Name"
                icon="/icons/firstName.png"
                error={blurErrors.firstName?.[0] || state.errors?.firstName?.[0]}
            />

            <FormInput
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Last Name"
                icon="/icons/lastName.png"
                error={blurErrors.lastName?.[0] || state.errors?.lastName?.[0]}
            />

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
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Email"
                icon="/icons/email.png"
                error={blurErrors.email?.[0] || state.errors?.email?.[0]}
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

            <FormInput
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm Password"
                icon="/icons/confirmPass.png"
                isPassword
                error={blurErrors.confirmPassword?.[0] || state.errors?.confirmPassword?.[0]}
            />



            <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                <span>I agree to all terms</span>
            </div>
            {serverMessage && (
                <p className="text-red-500 text-sm text-center">
                    {serverMessage}
                </p>
            )}

            <button
                type="submit"
                className="w-full bg-[#FF6767] cursor-pointer text-white py-2 rounded-md hover:opacity-90"
            >
                Register
            </button>
        </form>
    );
}