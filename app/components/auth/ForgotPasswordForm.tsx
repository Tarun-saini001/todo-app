"use client";

import { forgotPassword } from "@/app/actions/auth.actions";
import { useActionState, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import FormInput from "../ui/FormInput";
import { ForgotPasswordState } from "../../types/auth.types";

const initialState: ForgotPasswordState = {
    success: false,
    message: "",
    errors: {
        email: undefined,
    },
};

export default function ForgotPasswordForm() {
    const [isPending, startTransition] = useTransition();

    const [state, formAction] =
        useActionState<ForgotPasswordState, FormData>(
            forgotPassword,
            initialState
        );

    const [formData, setFormData] = useState({
        email: "",
    });

    const [blurErrors, setBlurErrors] = useState<{
        email?: string[];
    }>({});

    const [serverMessage, setServerMessage] = useState("");

    useEffect(() => {
        if (state.success) {
            toast.success(state.message, {
                id: "forgot-password-success",
            });
        }

        if (!state.success && state.message) {
            setServerMessage(state.message);

            toast.error(state.message, {
                id: "forgot-password-failed",
            });
        }
    }, [state]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setBlurErrors((prev) => ({
            ...prev,
            [e.target.name]: undefined,
        }));

        setServerMessage("");
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setServerMessage("");

        const submitData = new FormData();

        submitData.append("email", formData.email);

        startTransition(() => {
            formAction(submitData);
        });
    };
    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement>
    ) => {

        const value = e.target.value;

        if (!value) {
            setBlurErrors({
                email: ["Email is required"],
            });
        } else {
            setBlurErrors({});
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl text-center shadow w-[400px]"
        >
            <h2 className="text-2xl font-semibold mb-5">
                Forgot Password
            </h2>

            <FormInput
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Email"
                icon="/icons/email.png"
                error={
                    blurErrors.email?.[0] ||
                    state.errors?.email?.[0]
                }
            />

            {serverMessage && (
                <p className="text-red-500 border text-sm mt-1">
                    {serverMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="mt-4 bg-[#FF6767] text-white px-5 py-2 rounded-md"
            >
                {isPending
                    ? "Sending..."
                    : "Send Reset Link"}
            </button>
        </form>
    );
}