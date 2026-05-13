"use client";

import { useState } from "react";
import GoBackButton from "@/app/components/ui/GoBackButton";
import FormInput from "@/app/components/ui/FormInput";

export default function ChangePasswordClient({
    user,
}: any) {

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleBlur = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        return null
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 h-full">


            <div className="flex justify-between items-start mb-5">

                <h2
                    className="text-[28px] font-semibold text-gray-800
                    border-b-2 border-[#FF6767]
                    inline-block leading-tight"
                >
                    Change Password
                </h2>

                <GoBackButton />
            </div>


            <div className="flex items-center gap-3 mb-5">

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


            <div
                className=" rounded-xl w-full border  border-gray-200  px-10 py-6 "
            >

                <div className="max-w-[340px]   space-y-3">

                    <div>
                        <label className="text-sm font-medium block mb-1">
                            Current Password
                        </label>

                        <FormInput
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder=""
                            icon="/icons/password.png"
                            isPassword
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
                            placeholder=""
                            icon="/icons/password.png"
                            isPassword
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
                            placeholder=""
                            icon="/icons/password.png"
                            isPassword
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-2">

                        <button
                            className="bg-[#FF6767]
                            hover:bg-[#ff5252]
                            text-white text-sm
                            px-4 py-2 rounded-md
                            transition cursor-pointer"
                        >
                            Update Password
                        </button>

                        <button
                            type="button"
                            className="bg-gray-200 text-gray-700
                            text-sm px-4 py-2 rounded-md
                            hover:bg-gray-300
                            transition cursor-pointer"
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}