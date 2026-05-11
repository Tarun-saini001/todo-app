"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateProfile, updateProfileImage } from "@/app/actions/auth.actions";
import { imageSchema, profileSchema } from "@/app/validations/auth.user";
import GoBackButton from "../ui/GoBackButton";
import ConfirmModal from "../ui/ConfirmModal";

export default function ProfileClient({ user }: any) {

    const initialForm = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        userName: user.userName || "",
        email: user.email || "",
    };

    const [loading, setLoading] = useState(false);

    const [preview, setPreview] = useState(
        typeof user.profilePic === "string" && user.profilePic.trim() !== ""
            ? user.profilePic
            : "/todoprofile.png"
    );
    const [image, setImage] = useState<File | null>(null);

    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState<any>({});
    const [blurErrors, setBlurErrors] = useState<any>({});
    const [openRemoveModal, setOpenRemoveModal] = useState(false);
    const isChanged = form.firstName !== initialForm.firstName ||
        form.lastName !== initialForm.lastName ||
        form.userName !== initialForm.userName ||
        form.email !== initialForm.email;


    const handleImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;


        const result = imageSchema.safeParse(file);

        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("image", file);

        const res = await updateProfileImage(formData);

        if (!res.success) {
            toast.error(res.message);
            return;
        }

        toast.success("Profile image updated");
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });

        const result = profileSchema.safeParse({
            ...form,
            [name]: value,
        });

        if (!result.success) {

            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors((prev: any) => ({
                ...prev,
                [name]: fieldErrors[name as keyof typeof fieldErrors],
            }));

        } else {

            setErrors((prev: any) => ({
                ...prev,
                [name]: undefined,
            }));
        }

        setBlurErrors((prev: any) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        const result = profileSchema.safeParse({
            ...form,
            [name]: value,
        });

        if (!result.success) {

            const fieldErrors = result.error.flatten().fieldErrors;

            setBlurErrors((prev: any) => ({
                ...prev,
                [name]: fieldErrors[name as keyof typeof fieldErrors],
            }));

        } else {

            setBlurErrors((prev: any) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = async () => {
        setErrors({});
        setBlurErrors({});

        const result = profileSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors(fieldErrors);
            setLoading(false);

            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("firstName", form.firstName);
            formData.append("lastName", form.lastName);
            formData.append("userName", form.userName);
            formData.append("email", form.email);

            const res = await updateProfile(formData);

            if (!res.success) {
                setErrors(res.errors || {});
                toast.error(res.message || "Failed to update profile");
                setLoading(false);
                return;
            }

            toast.success("Profile updated successfully");

            Object.assign(initialForm, form);

        } catch (error) {
            console.log(error);

            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    console.log("------", preview);

    const removeImage = async () => {

        const formData = new FormData();

        formData.append("removeImage", "true");

        const res = await updateProfileImage(formData);

        if (!res.success) {
            toast.error(res.message);
            return;
        }

        setImage(null);
        setPreview("/todoprofile.png");

        toast.success("Profile image removed");
    };
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-start mb-8">

                <div className="flex items-center gap-6">

                    <div className="flex flex-col items-center gap-3">

                        <img
                            src={preview || "/todoprofile.png"}
                            alt="profile"
                            className="w-28 h-28 rounded-full object-cover border-2 border-gray-100 shadow-md"
                        />

                        <div className="flex gap-2">

                            <label className="bg-[#FF6767]  hover:bg-[#ff5252] transition text-white px-3 py-1.5 rounded-md cursor-pointer text-sm">
                                {user.profilePic ? "Change Image" : "Upload Image"}

                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImage}
                                />
                            </label>

                            {(image || (user.profilePic && preview !== "/todoprofile.png")) && (
                                <button
                                    type="button"
                                    onClick={() => setOpenRemoveModal(true)}
                                    className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-300 transition cursor-pointer"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {initialForm.firstName} {initialForm.lastName}
                        </h2>

                        <p className="text-gray-500 mt-1">
                            {initialForm.email}
                        </p>
                    </div>
                </div>

                <GoBackButton />
            </div>

            <div className="grid grid-cols-2 gap-6">

                <div>
                    <label className="block mb-2 font-medium">
                        First Name <span className="text-red-500 ">*</span>
                    </label>

                    <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={15}
                        className="w-full border rounded-md cursor-pointer px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6767] focus:border-transparent"
                    />

                    {(errors?.firstName?.[0] || blurErrors?.firstName?.[0]) && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors?.firstName?.[0] || blurErrors?.firstName?.[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Last Name <span className="text-red-500 ">*</span>
                    </label>

                    <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={15}
                        className="w-full border rounded-md cursor-pointer px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6767] focus:border-transparent"
                    />

                    {(errors?.lastName?.[0] || blurErrors?.lastName?.[0]) && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors?.lastName?.[0] || blurErrors?.lastName?.[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Username <span className="text-red-500 ">*</span>
                    </label>

                    <input
                        type="text"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={15}
                        className="w-full border rounded-md cursor-pointer px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6767] focus:border-transparent"
                    />

                    {(errors?.userName?.[0] || blurErrors?.userName?.[0]) && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors?.userName?.[0] || blurErrors?.userName?.[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Email <span className="text-red-500 ">*</span>
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={25}
                        className="w-full border cursor-pointer rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6767] focus:border-transparent"
                    />
                    {(errors?.email?.[0] || blurErrors?.email?.[0]) && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors?.email?.[0] || blurErrors?.email?.[0]}
                        </p>
                    )}
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading || !isChanged}
                className={`mt-8 px-6 py-2 rounded-md text-white transition
    ${loading || !isChanged ? "bg-[#FF6767]/50 cursor-not-allowed"
                        : "bg-[#FF6767] cursor-pointer"
                    }`}
            >
                {loading ? "Updating..." : "Update"}
            </button>

            <ConfirmModal
                open={openRemoveModal}
                onClose={() => setOpenRemoveModal(false)}
                onConfirm={async () => {
                    await removeImage();
                    setOpenRemoveModal(false);
                }}
                message="Are you sure you want to remove your profile image?"
            />
        </div>
    );
}