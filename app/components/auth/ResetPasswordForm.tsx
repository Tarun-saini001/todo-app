"use client";

import { resetPassword } from "@/app/actions/auth.actions";
import { resetPasswordSchema } from "@/app/validations/auth.user";
import {
    useActionState,
    useEffect,
    useState,
    useTransition,
} from "react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import FormInput from "../ui/FormInput";

import { ResetPasswordState }
    from "../../types/auth.types";

const initialState: ResetPasswordState = {
    success: false,
    message: "",
    errors: {},
};

export default function ResetPasswordForm({
    token,
}: {
    token: string;
}) {

    const router = useRouter();

    const [isPending, startTransition] =
        useTransition();

    const resetAction =
        resetPassword.bind(null, token);

    const [state, formAction] =
        useActionState<
            ResetPasswordState,
            FormData
        >(
            resetAction,
            initialState
        );

    const [formData, setFormData] =
        useState({
            password: "",
            confirmPassword: "",
        });

    const [blurErrors, setBlurErrors] =
        useState<{
            password?: string[];
            confirmPassword?: string[];
        }>({});

    const [serverMessage, setServerMessage] =
        useState("");

    useEffect(() => {

        if (state.success) {

            toast.success(state.message, {
                id: "reset-password-success",
            });

            setTimeout(() => {
                router.push("/sign-in");
            }, 1500);
        }

        if (!state.success && state.message) {

            setServerMessage(state.message);

            toast.error(state.message, {
                id: "reset-password-failed",
            });
        }

    }, [state, router]);

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

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement>
    ) => {

        const fieldName = e.target.name;

        const value = e.target.value;

        const result =
            resetPasswordSchema.safeParse({
                ...formData,
                [fieldName]: value,
            });

        if (!result.success) {

            const errors =
                result.error.flatten().fieldErrors;

            setBlurErrors((prev) => ({
                ...prev,
                [fieldName]:
                    errors[
                        fieldName as keyof typeof errors
                    ],
            }));

        } else {

            setBlurErrors((prev) => ({
                ...prev,
                [fieldName]: undefined,
            }));
        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setServerMessage("");

        const result =
            resetPasswordSchema.safeParse(
                formData
            );

        if (!result.success) {

            const errors =
                result.error.flatten().fieldErrors;

            setBlurErrors({
                password: errors.password,
                confirmPassword:
                    errors.confirmPassword,
            });

            return;
        }

        setBlurErrors({});

        const submitData = new FormData();

        submitData.append(
            "password",
            formData.password
        );

        submitData.append(
            "confirmPassword",
            formData.confirmPassword
        );

        startTransition(() => {
            formAction(submitData);
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 text-center rounded-xl shadow w-[400px]"
        >

            <h2 className="text-2xl font-semibold mb-5">
                Reset Password
            </h2>

            <div className="space-y-4">

                <FormInput
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="New Password"
                    icon="/icons/password.png"
                    isPassword
                    error={
                        blurErrors.password?.[0] ||
                        state.errors?.password?.[0]
                    }
                />

                <FormInput
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm Password"
                    icon="/icons/password.png"
                    isPassword
                    error={
                        blurErrors
                            .confirmPassword?.[0] ||
                        state.errors
                            ?.confirmPassword?.[0]
                    }
                />

                {serverMessage && (
                    <p className="text-red-500 text-sm">
                        {serverMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 bg-[#FF6767] text-white px-5 py-2 rounded-md w-full"
                >
                    {isPending
                        ? "Resetting..."
                        : "Reset Password"}
                </button>

            </div>
        </form>
    );
}