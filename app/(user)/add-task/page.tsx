"use client";

import GoBackButton from "@/app/components/ui/GoBackButton";
import { taskSchema } from "@/app/validations/task";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineCloseFullscreen } from "react-icons/md";

export default function AddTaskPage() {
    const searchParams = useSearchParams();
    const taskId = searchParams.get("id");

    const isEdit = Boolean(taskId);
    const router = useRouter();

    const getTodayDate = () => {
        const today = new Date();
        console.log('today: ', today);
        return today.toISOString().split("T")[0];
    };

    const [form, setForm] = useState({
        title: "",
        date: getTodayDate(),
        priority: "Moderate",
        description: "",
        status: "Not Started",
        image: null as File | null,
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [blurErrors, setBlurErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [originalData, setOriginalData] = useState<any>(null);
    const [openPreview, setOpenPreview] = useState(false);

    const isChanged = () => {
        if (!originalData) return true;

        return (
            form.title !== originalData.title ||
            form.date !== originalData.date ||
            form.priority !== originalData.priority ||
            form.description !== originalData.description ||
            form.status !== originalData.status ||
            form.image !== null
        );
    };

    useEffect(() => {
        return () => {
            if (previewImage?.startsWith("blob:")) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    useEffect(() => {
        if (!taskId) return;

        const fetchTask = async () => {
            try {
                setFetching(true)
                const res = await fetch(`/api/task/${taskId}`, {
                    credentials: "include",
                });

                const data = await res.json();
                console.log('data: fetch task by id', data);


                if (!res.ok) {
                    toast.error(data.message);
                    return;
                }


                setForm({
                    title: data.title || "",
                    date: data.date?.split("T")[0] || "",
                    priority: data.priority || "Moderate",
                    status: data.status || "Not Started",
                    description: data.description || "",
                    image: null,
                });
                console.log("FORM STATUS:", form.status);
                console.log("API STATUS:", data.status);
                setPreviewImage(data.image || null);
                setOriginalData({
                    title: data.title,
                    date: data.date?.split("T")[0],
                    priority: data.priority,
                    description: data.description,
                    status: data.status,
                });
                setFetching(false);

            } catch (err) {
                console.log(err);
                toast.error("Failed to load task");
                setFetching(false);
            }
        };

        fetchTask();
    }, [taskId]);

    if (isEdit && fetching) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Loading task...</p>
            </div>
        );
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        const formattedValue =
            name === "title"
                ? value.charAt(0).toUpperCase() + value.slice(1)
                : value;

        const updatedForm = {
            ...form,
            [name]: formattedValue,
        };

        setForm(updatedForm);


        const result = taskSchema.safeParse(updatedForm);

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
            [e.target.name]: undefined,
        }));
        // setErrors((prev: any) => ({
        //     ...prev,
        //     [e.target.name]: undefined,
        // }));
    };


    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            return;
        }

        setForm((prev) => ({
            ...prev,
            image: file,
        }));

        setPreviewImage(URL.createObjectURL(file));

        setErrors((prev: any) => ({
            ...prev,
            image: undefined,
        }));

        setBlurErrors((prev: any) => ({
            ...prev,
            image: undefined,
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const fieldName = e.target.name;
        const value = e.target.value;

        const result = taskSchema.safeParse({
            ...form,
            [fieldName]: value,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setBlurErrors((prev: any) => ({
                ...prev,
                [fieldName]: fieldErrors[fieldName as keyof typeof fieldErrors],
            }));
        } else {
            setBlurErrors((prev: any) => ({
                ...prev,
                [fieldName]: undefined,
            }));
        }
    };


    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});
        setBlurErrors({});

        const result = taskSchema.safeParse({
            ...form,
            image: form.image || previewImage,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            setLoading(false);
            return;
        }
        if (isEdit && !isChanged()) {
            toast("No changes made", {
                id: "no-changes"
            });
            setLoading(false);
            return;
        }
        try {

            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("date", form.date);
            formData.append("priority", form.priority);
            formData.append("description", form.description);
            formData.append("status", form.status);

            if (form.image) {
                formData.append("image", form.image);
            }
            const res = await fetch(
                isEdit ? `http://localhost:3000/api/task/${taskId}` : "http://localhost:3000/api/task", {
                method: isEdit ? "PUT" : "POST",
                body: formData,
            });

            const data = await res.json();
            console.log('data: ', data);

            if (!res.ok) {
                setErrors(data.errors?.fieldErrors || {});
                toast.error(data.message);
                setLoading(false);
                return;
            }

            toast.success(
                isEdit ? "Task updated successfully" : "Task created successfully"
            );
            router.push("/");
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    // const previewImage = newImagePreview || currentImage;

    return (
        <div className="h-full flex flex-col">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold border-b-2 border-[#FF6767] inline-block">
                    {isEdit ? "Edit Task" : "Add New Task"}
                </h2>


                <GoBackButton />
            </div>


            <div className="border-[#FF6767] p-6 rounded-lg bg-white flex-1 overflow-auto">


                <div className="mb-4">
                    <label className="block mb-1 font-medium">Title <span className="text-red-500 ">*</span></label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={15}
                        className="w-full border cursor-pointer text-gray-800 border-gray-300 rounded-md px-3 py-2 outline-none 
                        focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767] 
                        transition"
                        placeholder="Enter task title..."
                    />
                    {(errors?.title?.[0] || blurErrors?.title?.[0]) && (
                        <p className="text-red-500 text-sm">
                            {errors?.title?.[0] || blurErrors?.title?.[0]}
                        </p>
                    )}
                </div>


                <div className="mb-4">
                    <label className="block mb-1 font-medium">Date <span className="text-red-500 ">*</span></label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border cursor-pointer text-gray-800 border-gray-300 rounded-md px-3 py-2 outline-none 
                   focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767] 
                   transition"
                    />
                    {(errors?.date?.[0] || blurErrors?.date?.[0]) && (
                        <p className="text-red-500 text-sm">
                            {errors?.date?.[0] || blurErrors?.date?.[0]}
                        </p>
                    )}
                </div>


                <div className="grid grid-cols-2 p-2 rounded border-gray-300 gap-6 shadow my-6">


                    <div>
                        <label className="block mb-2 font-medium">Priority <span className="text-red-500 ">*</span></label>
                        <div className="flex gap-6">
                            {["Extreme", "Moderate", "Low"].map((level) => (
                                <label key={level} className="flex  items-center gap-2">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={level}
                                        checked={form.priority === level}
                                        onChange={handleChange}
                                        className="cursor-pointer"
                                    />
                                    {level}
                                </label>
                            ))}
                        </div>
                    </div>


                    {isEdit && (
                        <div>
                            <label className="block mb-2 font-medium">Status <span className="text-red-500 ">*</span></label>
                            <div className="flex gap-6">
                                {["Not Started", "In-Progress", "Completed"].map((status) => (
                                    <label key={status} className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="radio"
                                            name="status"
                                            value={status}
                                            checked={form.status === status}
                                            onChange={handleChange}
                                            className="cursor-pointer"
                                        />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


                <div className="grid grid-cols-2 gap-6 mb-6">

                    <div>
                        <label className="block mb-1 font-medium">
                            Task Description <span className="text-red-500 ">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            maxLength={250}
                            onChange={handleChange}
                            className="w-full h-40 border cursor-pointer border-gray-300 rounded-md px-3 py-2 outline-none 
                   focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767] 
                   transition"
                            placeholder="Start writing here..."
                        />
                        {blurErrors?.description?.[0] && (
                            <p className="text-red-500 text-sm">
                                {blurErrors.description[0]}
                            </p>
                        )}
                        {errors?.description && (
                            <p className="text-red-500 text-sm">
                                {errors.description[0]}
                            </p>
                        )}
                    </div>


                    <div>
                        <label className="block mb-1 font-medium">
                            Upload Image <span className="text-red-500 ">*</span>
                        </label>
                        <label className="cursor-pointer block">
                            <div className="w-full h-40 border border-dashed rounded-xl overflow-hidden  flex  items-center justify-center">

                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Selected task image"
                                        className="w-full h-full object-cover"
                                    />

                                ) : (
                                    <p className="text-gray-400">
                                        Click to upload image
                                    </p>
                                )}

                            </div>
                            {previewImage && (
                                <div className="flex items-center gap-4 mt-2">

                                    <button
                                        type="button"
                                        onClick={() => setOpenPreview(true)}
                                        className="underline text-[#FF6767] text-sm cursor-pointer"
                                    >
                                        View Image
                                    </button>

                                    <label className="underline text-gray-600 text-sm cursor-pointer">
                                        Change

                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg,.webp"
                                            onChange={(e) => {
                                                handleImage(e);
                                                e.target.value = "";
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            )}

                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp"
                                onChange={(e) => {
                                    handleImage(e);
                                    e.target.value = "";
                                }}
                                className="hidden "
                            />
                        </label>

                        {errors?.image && (
                            <p className="text-red-500 text-sm">
                                {errors.image[0]}
                            </p>
                        )}
                    </div>
                </div>


                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#FF6767] border cursor-pointer text-white px-6 py-2 rounded-md"
                >
                    {loading ? "Creating..." : "Done"}
                </button>
            </div>
            {openPreview && previewImage && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">

                    <div className="relative bg-white rounded-2xl p-4 max-w-4xl w-full">

                        <button
                            type="button"
                            onClick={() => setOpenPreview(false)}
                            className="absolute top-3 right-3  text-black text-lg w-8 h-8 rounded-full cursor-pointer"
                        >
                            <MdOutlineCloseFullscreen />
                        </button>

                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full max-h-[80vh] object-contain rounded-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}