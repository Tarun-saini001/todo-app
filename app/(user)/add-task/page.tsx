"use client";

import GoBackButton from "@/app/components/ui/GoBackButton";
import { taskSchema } from "@/app/validations/task";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
        const updatedForm = { ...form, [name]: value };
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
        if (e.target.files?.[0]) {
            const file = e.target.files[0];

            setForm({ ...form, image: file });

            setPreviewImage(URL.createObjectURL(file));
        }
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

            
                <GoBackButton/>
            </div>


            <div className="border-[#FF6767] p-6 rounded-lg bg-white flex-1 overflow-auto">


                <div className="mb-4">
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={15}
                        className="w-full border text-gray-800 border-gray-300 rounded-md px-3 py-2 outline-none 
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
                    <label className="block mb-1 font-medium">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border text-gray-800 border-gray-300 rounded-md px-3 py-2 outline-none 
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
                        <label className="block mb-2 font-medium">Priority</label>
                        <div className="flex gap-6">
                            {["Extreme", "Moderate", "Low"].map((level) => (
                                <label key={level} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={level}
                                        checked={form.priority === level}
                                        onChange={handleChange}
                                    />
                                    {level}
                                </label>
                            ))}
                        </div>
                    </div>


                    {isEdit && (
                        <div>
                            <label className="block mb-2 font-medium">Status</label>
                            <div className="flex gap-6">
                                {["Not Started", "In-Progress", "Completed"].map((status) => (
                                    <label key={status} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="status"
                                            value={status}
                                            checked={form.status === status}
                                            onChange={handleChange}
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
                            Task Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            maxLength={250}
                            onChange={handleChange}
                            className="w-full h-40 border  border-gray-300 rounded-md px-3 py-2 outline-none 
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
                            Upload Image
                        </label>
                        <label className="cursor-pointer block">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Selected task image"
                                    className="w-full h-40 object-cover rounded"
                                />
                            ) : (
                                <div className="w-full h-40 border border-dashed flex items-center justify-center text-gray-400">
                                    Click to upload image
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    handleImage(e);
                                    e.target.value = "";
                                }}
                                className="hidden"
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
                    className="bg-[#FF6767] cursor-pointer text-white px-6 py-2 rounded-md"
                >
                    {loading ? "Creating..." : "Done"}
                </button>
            </div>
        </div>
    );
}