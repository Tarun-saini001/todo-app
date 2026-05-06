"use client";

import { useState } from "react";
import TaskCard from "@/app/components/dashboard/TaskCard";
import TaskDetail from "@/app/components/ui/TaskDetail";
import { deleteTask } from "@/app/actions/task.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "@/app/components/ui/DeleteTask";

export default function MyTasksClient({
    initialTasks,
    emptyTitle = "No Tasks Found",
    emptyMessage = "You don't have any tasks yet.",
    showAddButton = false,
}: any) {

    const router = useRouter();


    if (!initialTasks || initialTasks.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        {emptyTitle}
                    </h2>
                    <p className="text-gray-500 mb-4">
                        {emptyMessage}
                    </p>

                    {showAddButton && (
                        <button
                            onClick={() => router.push("/add-task")}
                            className="bg-[#FF6767] text-white px-5 py-2 rounded-md"
                        >
                            + Add Task
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const [tasks, setTasks] = useState(initialTasks);
    const [selectedTask, setSelectedTask] = useState(
        initialTasks?.[0] || null
    );
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleDelete = async () => {
        if (!selectedTask) return;

        setLoading(true);

        const res = await deleteTask(selectedTask._id);

        if (!res.success) {
            toast.error(res.message || "Failed to delete");
            setLoading(false);
            return;
        }

        toast.success("Task deleted");


        const updatedTasks = tasks.filter(
            (t: any) => t._id !== selectedTask._id
        );

        setTasks(updatedTasks);
        setSelectedTask(updatedTasks[0] || null);

        setOpenModal(false);


        router.refresh();

        setLoading(false);
    };

    return (<>
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
                <TaskDetail
                    task={selectedTask}
                    onDelete={() => setOpenModal(true)}
                />
            </div>

        </div>
        <DeleteConfirmModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onConfirm={handleDelete}
            loading={loading}
        />
    </>

    );
}