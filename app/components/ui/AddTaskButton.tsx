"use client";

import { useRouter } from "next/navigation";

export default function AddTaskCTA() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/add-task")}
            className="bg-[#FF6767] text-white px-5 py-2 cursor-pointer rounded-md"
        >
            + Add Task
        </button>
    );
}