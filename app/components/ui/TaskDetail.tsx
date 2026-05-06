"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface Task {
    _id: string;
    title: string;
    description: string;
    image?: string;
    priority: string;
    status: string;
    createdAt: string;
}

export default function TaskDetail({
    task,
    onDelete,
}: {
    task: Task | null;
    onDelete: () => void;
}) {
    const router = useRouter();
    if (!task) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                Select a task to view details
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">


            <div className="flex-1 overflow-y-auto pr-2">

                <div className="flex gap-4 mb-5">
                    {task.image && (
                        <Image
                            src={task.image}
                            alt="task"
                            width={120}
                            height={120}
                            className="rounded-xl object-cover w-32 h-28"
                        />
                    )}

                    <div className="flex flex-col justify-between">
                        <h2 className="text-lg font-semibold">
                            {task.title}
                        </h2>

                        <div className="text-sm space-y-1">
                            <p>
                                <span className="font-medium">Priority:</span>{" "}
                                <span
                                    className={
                                        task.priority === "Low"
                                            ? "text-green-500"
                                            : task.priority === "Moderate"
                                                ? "text-blue-500"
                                                : "text-red-500"
                                    }
                                >
                                    {task.priority}
                                </span>
                            </p>

                            <p>
                                <span className="font-medium">Status:</span>{" "}
                                <span
                                    className={
                                        task.status === "Completed"
                                            ? "text-green-500"
                                            : task.status === "In-Progress"
                                                ? "text-blue-500"
                                                : "text-red-500"
                                    }
                                >
                                    {task.status}
                                </span>
                            </p>

                            <p className="text-gray-400 text-xs">
                                Created:{" "}
                                {new Date(task.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>


                <div>
                    <h4 className="font-medium text-sm mb-2">Description</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {task.description}
                    </p>
                </div>
            </div>


            <div className="flex justify-end gap-3 pt-4  mt-4 bg-white">
                <button
                    onClick={onDelete}
                    className="bg-[#FF6767] cursor-pointer text-white text-center rounded flex justify-center text-lg items-center h-7 w-7">
                    <MdDelete />
                </button>

                <button
                    onClick={() => router.push(`/add-task?id=${task._id}`)}
                    className="bg-[#FF6767] cursor-pointer text-white text-center rounded flex justify-center items-center h-7 w-7">
                    <FaRegEdit />
                </button>
            </div>
        </div>
    );
}