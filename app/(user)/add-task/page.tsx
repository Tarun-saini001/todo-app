"use client";

import { useRouter } from "next/navigation";

export default function AddTaskPage() {
    const router = useRouter();

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
                        className="w-full border text-gray-400 border-gray-300 rounded-md px-3 py-2 outline-none 
                        focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767] 
                        transition"
                        placeholder="Enter task title..."
                    />
                </div>


                <div className="mb-4">
                    <label className="block mb-1 font-medium">Date</label>
                    <input
                        type="date"
                        className="w-full border text-gray-400 border-gray-300 rounded-md px-3 py-2 outline-none 
                   focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767] 
                   transition"
                    />
                </div>


                <div className="mb-4">
                    <label className="block mb-2 font-medium">Priority</label>
                    <div className="flex gap-6">
                        {["Extreme", "Moderate", "Low"].map((level) => (
                            <label key={level} className="flex items-center gap-2">
                                <input type="radio" name="priority" />
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
                            className="w-full h-40 border  border-gray-300 rounded-md px-3 py-2 outline-none 
                   focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767] 
                   transition"
                            placeholder="Start writing here..."
                        />
                    </div>


                    <div>
                        <label className="block mb-1 font-medium">
                            Upload Image
                        </label>

                        <div className="border rounded-md h-40 flex flex-col items-center justify-center text-gray-400">
                            <p>Upload An Image Here</p>
                            <p className="text-sm">or</p>
                            <button className="mt-2 px-3 py-1 cursor-pointer border rounded">
                                Browse
                            </button>
                        </div>
                    </div>
                </div>


                <button className="bg-[#FF6767] text-white px-6 py-2 rounded-md">
                    Done
                </button>
            </div>
        </div>
    );
}