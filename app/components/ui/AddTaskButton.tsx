"use client";

import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";

export default function AddTaskButton() {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push("/add-task")}
            className="shadow-lg px-6 py-4 flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg"
        >
            <FiPlus className="text-[#FF6767]" />
            <button>Add Task</button>
        </div>
    );
}