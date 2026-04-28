"use client";

import { registerUser } from "@/app/actions/auth.actions";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerSchema } from "@/app/validations/auth.user";
import { FaEye, FaEyeSlash } from "react-icons/fa";


type FormState = {
    success: boolean;
    errors: {
        firstName?: string[];
        lastName?: string[];
        userName?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    message: string;
};


const initialState: FormState = {
    success: false,
    errors: {},
    message: "",
};

export default function RegisterForm() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [blurErrors, setBlurErrors] = useState<FormState["errors"]>({});
    const router = useRouter();
    const [state, formAction] = useActionState(registerUser, initialState);

    useEffect(() => {
        const saved = localStorage.getItem("registerForm");
        if (saved) {
            setFormData(JSON.parse(saved));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem("registerForm", JSON.stringify(formData));
    }, [formData]);
    useEffect(() => {
        if (state.success) {
            localStorage.removeItem("registerForm");
        }
    }, [state.success]);

    useEffect(() => {
        if (state.success) {
            router.push("/sign-in");
        }
    }, [state.success]);

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
        }
    }, [state.success]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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

            <div className="relative">
                <img
                    src="./icons/firstName.png"
                    alt="first name icon"
                    className="absolute left-3 top-2.5 w-4 h-4 opacity-70"
                />
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter First Name"
                    className="w-full h-10 border pl-10 pr-10 rounded-md p-2 outline-none focus:ring-2 focus:ring-[#FF6767]"
                />
                {(blurErrors.firstName || state.errors?.firstName) && (
                    <p className="text-red-500 text-xs mt-1">
                        {blurErrors.firstName?.[0] || state.errors.firstName?.[0]}
                    </p>
                )}
            </div>

            <div className="relative">
                <img
                    src="./icons/lastName.png"
                    alt="last name icon"
                   className="absolute left-3 top-2.5 w-4 h-4 opacity-70"
                />
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Last Name"
                   className="w-full h-10 border pl-10 pr-10 rounded-md p-2 outline-none focus:ring-2 focus:ring-[#FF6767]"
                />
                {(blurErrors.lastName || state.errors?.lastName) && (
                    <p className="text-red-500 text-xs mt-1">
                        {blurErrors.lastName?.[0] || state.errors.lastName?.[0]}
                    </p>
                )}
            </div>


            <div className="relative">
                <img
                    src="./icons/userName.png"
                    alt="user name icon"
                   className="absolute left-3 top-2.5 w-4 h-4 opacity-70"
                />
                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Username"
                  className="w-full h-10 border pl-10 pr-10 rounded-md p-2 outline-none focus:ring-2 focus:ring-[#FF6767]"
                />
                {(blurErrors.userName || state.errors?.userName) && (
                    <p className="text-red-500 text-xs mt-1">
                        {blurErrors.userName?.[0] || state.errors.userName?.[0]}
                    </p>
                )}
            </div>

            <div className="relative">
                <img
                    src="./icons/email.png"
                    alt="email icon"
                  className="absolute left-3 top-2.5 w-4 h-4 opacity-70"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Email"
                   className="w-full h-10 border pl-10 pr-10 rounded-md p-2 outline-none focus:ring-2 focus:ring-[#FF6767]"
                />
                {(blurErrors.email || state.errors?.email) && (
                    <p className="text-red-500 text-xs mt-1">
                        {blurErrors.email?.[0] || state.errors.email?.[0]}
                    </p>
                )}
            </div>

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
                        {blurErrors.password?.[0] || state.errors.password?.[0]}
                    </p>
                )}
            </div>


            <div className="relative">
                <img
                    src="./icons/confirmPass.png"
                    alt="confirm passwor icon"
                   className="absolute left-3 top-2.5 w-4 h-4 opacity-70"
                />
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-10 border rounded-md p-2 outline-none focus:ring-2 focus:ring-[#FF6767]"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                   className="absolute right-3 top-2.5 text-gray-500 hover:text-black"
                >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
                {(blurErrors.confirmPassword || state.errors?.confirmPassword) && (
                    <p className="text-red-500 text-xs mt-1">
                        {blurErrors.confirmPassword?.[0] || state.errors.confirmPassword?.[0]}
                    </p>
                )}
            </div>


            <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                <span>I agree to all terms</span>
            </div>
            {state.message && (
                <p className="text-red-500 text-sm text-center">
                    {state.message}
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