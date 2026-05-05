"use client";

import Image from "next/image";

interface Task {
    _id: string;
    title: string;
    description: string;
    image: string;
    priority: string;
    status: string;
}

export default function TaskCard({ task }: { task: Task }) {
    const priorityColor =
        task.priority === "Low"
            ? "text-green-600"
            : task.priority === "Moderate"
                ? " text-blue-600"
                : " text-red-600";

    const statusColor =
        task.status === "Completed"
            ? " text-green-600"
            : task.status === "In-Progress"
                ? " text-blue-600"
                : " text-red-600";

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300 hover:shadow-md transition flex justify-between gap-4">

            {/* left side */}
            <div className="flex flex-col justify-between flex-1">

                <div>
                    <h3 className="font-semibold text-sm text-gray-800">
                        {task.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {task.description}
                    </p>
                </div>


                <div className="flex gap-2 mt-4 text-xs">

                    <span className="px-2 py-1 rounded-full text-black">
                        priority:{" "}
                        <span className={priorityColor}>
                            {task.priority}
                        </span>
                    </span>

                    <span className="px-2 py-1 rounded-full text-black">
                        status:{" "}
                        <span className={statusColor}>
                            {task.status}
                        </span>
                    </span>

                </div>
            </div>


            {task.image && (
                <div className="w-[70px] h-[70px] relative shrink-0">
                    <Image
                        src={task.image}
                        alt="task"
                        fill
                        className="rounded-lg object-cover"
                    />
                </div>
            )}
        </div>
    );
}