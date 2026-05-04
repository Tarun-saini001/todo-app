"use client";

import { taskSchema } from "@/app/validations/task";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddTaskPage() {

    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        date: "",
        priority: "Moderate",
        description: "",
        image: null as File | null,
    });

    const [errors, setErrors] = useState<any>({});
    const [blurErrors, setBlurErrors] = useState<any>({ undefined });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });


        setBlurErrors((prev: any) => ({
            ...prev,
            [e.target.name]: undefined,
        }));
        setErrors((prev: any) => ({
            ...prev,
            [e.target.name]: undefined,
        }));
    };


    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setForm({ ...form, image: e.target.files[0] });
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

        const result = taskSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            setLoading(false);
            return;
        }

        try {

            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("date", form.date);
            formData.append("priority", form.priority);
            formData.append("description", form.description);

            if (form.image) {
                formData.append("image", form.image);
            }
            const res = await fetch("http://localhost:3000/api/task", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log('data: ', data);

            if (!res.ok) {
                setErrors(data.errors?.fieldErrors || { });
                toast.error(data.message);
                setLoading(false);
                return;
            }

            toast.success("Task created successfully");
            router.push("/");
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold border-b-2 border-[#FF6767] inline-block">
                    Add New Task
                </h2>

                <button
                    onClick={() => router.back()}
                    className=" underline cursor-pointer"
                >
                    Go Back
                </button>
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
                        className="w-full border text-gray-400 border-gray-300 rounded-md px-3 py-2 outline-none 
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
                        className="w-full border text-gray-400 border-gray-300 rounded-md px-3 py-2 outline-none 
                   focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767] 
                   transition"
                    />
                    {(errors?.date?.[0] || blurErrors?.date?.[0]) && (
                        <p className="text-red-500 text-sm">
                            {errors?.date?.[0] || blurErrors?.date?.[0]}
                        </p>
                    )}
                </div>


                <div className="mb-4">
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


                <div className="grid grid-cols-2 gap-6 mb-6">

                    <div>
                        <label className="block mb-1 font-medium">
                            Task Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
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

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="w-full h-40 border  border-gray-300  p-2  rounded-md"
                        />

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