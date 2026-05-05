"use client";

import { useState } from "react";
import TaskCard from "@/app/components/dashboard/TaskCard";
import TaskDetail from "@/app/components/ui/TaskDetail";

export default function MyTasksClient({ initialTasks }: any) {
    const [tasks] = useState(initialTasks);
    const [selectedTask, setSelectedTask] = useState(
        initialTasks?.[0] || null
    );

    return (
        <div className="h-full grid grid-cols-[480px_1fr] gap-6 overflow-hidden">


            <div className="bg-white p-4 rounded-2xl  shadow-sm flex flex-col h-full overflow-hidden">
                <h3 className="font-semibold mb-4 shrink-0">My Tasks</h3>

                <div className="flex-1 p-1 overflow-y-auto pr-2 space-y-4">
                    {tasks.map((task: any) => (
                        <div
                            key={task._id}
                            onClick={() => setSelectedTask(task)}
                            className={`cursor-pointer rounded-xl transition ${selectedTask?._id === task._id
                                ? "ring-2 ring-[#FF6767]  bg-red-100"
                                : "hover:bg-gray-50"

                                }`}
                        >
                            <TaskCard task={task} />
                        </div>
                    ))}
                </div>
            </div>


            <div className="bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
                <TaskDetail task={selectedTask} />
            </div>

        </div>
    );
}