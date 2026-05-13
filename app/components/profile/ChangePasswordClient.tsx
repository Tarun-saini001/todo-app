"use client";

import { useState } from "react";
import GoBackButton from "@/app/components/ui/GoBackButton";
import FormInput from "@/app/components/ui/FormInput";
import { changePasswordSchema } from "@/app/validations/auth.user";
import { changePassword } from "@/app/actions/auth.actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function ChangePasswordClient({
    user,
}: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const [blurErrors, setBlurErrors] = useState<any>({});

    const [serverMessage, setServerMessage] =
        useState("");

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const validateForm = (data: typeof formData) => {

        const result =
            changePasswordSchema.safeParse(data);

        if (!result.success) {

            return result.error.flatten().fieldErrors;
        }

        return {};
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        const updatedForm = {
            ...formData,
            [name]: value,
        };

        setFormData(updatedForm);

        const errors = validateForm(updatedForm);

        setBlurErrors(errors);

        setServerMessage("");
    };


    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement>
    ) => {

        const updatedForm = {
            ...formData,
            [e.target.name]: e.target.value,
        };

        const errors = validateForm(updatedForm);

        setBlurErrors(errors);
    };


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setBlurErrors({});
        setServerMessage("");

        const result =
            changePasswordSchema.safeParse(
                formData
            );

        if (!result.success) {

            const fieldErrors =
                result.error.flatten().fieldErrors;

            setBlurErrors(fieldErrors);

            return;
        }

        setLoading(true);

        try {

            const submitData = new FormData();

            submitData.append(
                "currentPassword",
                formData.currentPassword
            );

            submitData.append(
                "newPassword",
                formData.newPassword
            );

            submitData.append(
                "confirmPassword",
                formData.confirmPassword
            );

            const res =
                await changePassword(submitData);

            if (!res.success) {

                setServerMessage(res.message);

                toast.error(
                    res.message ||
                    "Failed to change password"
                );

                setLoading(false);

                return;
            }

            toast.success(
                "Password updated successfully"
            );

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (error) {

            console.log(error);

            toast.error("Something went wrong");

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="bg-white  rounded-2xl shadow-sm p-5 h-auto">

            <div className="flex  justify-between items-start mb-5">

                <h2
                    className="text-[28px] font-semibold text-gray-800
                border-b-2 border-[#FF6767]
                inline-block leading-tight"
                >
                    Change Password
                </h2>

                <GoBackButton />
            </div>

            <div className="flex  items-center gap-3 mb-5">

                <img
                    src={
                        user.profilePic &&
                            user.profilePic.trim() !== ""
                            ? user.profilePic
                            : "/todoprofile.png"
                    }
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover border"
                />

                <div>
                    <h3 className="text-base font-semibold leading-tight">
                        {user.firstName} {user.lastName}
                    </h3>

                    <p className="text-gray-500 text-sm">
                        {user.email}
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-xl w-full    border border-gray-200 px-10 py-6"
            >

                <div className="max-w-[340px] space-y-3">

                    <div>
                        <label className="text-sm font-medium block mb-1">
                            Current Password
                        </label>

                        <FormInput
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter Current Password"
                            icon="/icons/password.png"
                            isPassword
                            error={blurErrors?.currentPassword?.[0]}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-1">
                            New Password
                        </label>

                        <FormInput
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter Password"
                            icon="/icons/password.png"
                            isPassword
                            error={blurErrors?.newPassword?.[0]}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-1">
                            Confirm Password
                        </label>

                        <FormInput
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Confirm Password"
                            icon="/icons/password.png"
                            isPassword
                            error={blurErrors?.confirmPassword?.[0]}
                        />
                    </div>

                    {serverMessage && (
                        <p className="text-red-500 text-sm">
                            {serverMessage}
                        </p>
                    )}

                    <div className="flex items-center gap-3 pt-2">

                        <button
                            type="submit"
                            disabled={loading}
                            className={`text-white text-sm
                        px-4 py-2 rounded-md transition
                        ${loading
                                    ? "bg-[#FF6767]/50 cursor-not-allowed"
                                    : "bg-[#FF6767] hover:bg-[#ff5252] cursor-pointer"
                                }`}
                        >
                            {loading
                                ? "Updating..."
                                : "Update Password"}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/profile")}
                            className="bg-gray-200 text-gray-700
                        text-sm px-4 py-2 rounded-md
                        hover:bg-gray-300
                        transition cursor-pointer"
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </form>

        </div>
    );

}