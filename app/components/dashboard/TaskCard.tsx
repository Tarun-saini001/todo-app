"use client";

import Image from "next/image";
import { useState } from "react";
import ChangeStatus from "@/app/components/ui/ConfirmModal";
import { updateTaskStatus } from "@/app/actions/task.action";
import { useRouter } from "next/navigation";

interface Task {
    _id: string;
    title: string;
    description: string;
    image: string;
    priority: string;
    status: string;
}

export default function TaskCard({ task }: { task: Task }) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [nextStatus, setNextStatus] = useState("");

    const priorityColor =
        task.priority === "Low"
            ? "text-green-600"
            : task.priority === "Moderate"
                ? "text-blue-600"
                : "text-red-600";

    const statusColor =
        task.status === "Completed"
            ? "text-green-600"
            : task.status === "In-Progress"
                ? "text-blue-600"
                : "text-red-600";


    const getNextStatus = () => {
        if (task.status === "Not Started") return "In-Progress";
        if (task.status === "In-Progress") return "Completed";
        return null;
    };

    const handleClick = () => {
        const status = getNextStatus();
        if (!status) return;

        setNextStatus(status);
        setOpen(true);
    };

    const handleConfirm = async () => {
        await updateTaskStatus(task._id, nextStatus);
        setOpen(false);
        router.refresh();
    };

    const next = getNextStatus();

    return (
        <>
            <div
                onClick={() => router.push(`/task/${task._id}`)}
                className="bg-white rounded-2xl p-4 cursor-pointer shadow-sm border border-gray-300 hover:shadow-md transition flex justify-between gap-4">


                <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                        <h3 className="font-semibold text-md text-gray-800">
                            {task.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {task.description}
                        </p>
                    </div>

                    <div className="flex gap-2 mt-4 text-xs">
                        <span>
                            priority:{" "}
                            <span className={priorityColor}>
                                {task.priority}
                            </span>
                        </span>

                        <span>
                            status:{" "}
                            <span className={statusColor}>
                                {task.status}
                            </span>
                        </span>
                    </div>
                </div>


                <div className="flex flex-col items-center gap-2  flex-shrink-0">
                    {task.image && (
                        <div className="w-[70px] h-[70px] relative">
                            <Image
                                src={task.image}
                                alt="task"
                                fill
                                className="rounded-lg object-cover"
                            />
                        </div>
                    )}


                    {next && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
                            className="text-xs  text-[#FF6767] underline cursor-pointer px-2 py-1 rounded"
                        >
                            {next === "Completed" ? "Complete" : "Start"}
                        </button>
                    )}
                </div>
            </div>


            <ChangeStatus
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleConfirm}
                message={`Mark this task as ${nextStatus}?`}
            />
        </>
    );
}