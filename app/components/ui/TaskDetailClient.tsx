"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TaskDetail from "@/app/components/ui/TaskDetail";
import DeleteConfirmModal from "@/app/components/ui/DeleteTask";
import { deleteTask } from "@/app/actions/task.action";
import toast from "react-hot-toast";

export default function TaskDetailClient({ task }: any) {
    const router = useRouter();

    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        const res = await deleteTask(task._id);
        console.log('res: dalete ', res);

        if (!res.success) {
            toast.error(res.message);
            setLoading(false);
            return;
        }

        toast.success("Task deleted");
        router.push("/my-task");

        setLoading(false);
    };

    return (
        <>
            <TaskDetail
                task={task}
                onDelete={() => setOpenModal(true)}
            />

            <DeleteConfirmModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleDelete}
                loading={loading}
            />
        </>
    );
}