"use client";

import { useRouter } from "next/navigation";

export default function AddTaskCTA() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/add-task")}
            className=" text-gray-500 px-5 py-2 cursor-pointer rounded-md"
        >
            <span className="text-[#FF6767] text-2xl">+</span> Add Task
        </button>
    );
}