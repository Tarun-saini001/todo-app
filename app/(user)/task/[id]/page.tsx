import { getUser } from "@/app/lib/auth";
import connectDB from "@/app/lib/db";
import { Task } from "@/app/lib/models/task";
import { notFound } from "next/navigation";
import TaskDetailClient from "@/app/components/ui/TaskDetailClient";
import GoBackButton from "@/app/components/ui/GoBackButton";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    await connectDB();

    const user = await getUser();

    const task = await Task.findOne({
        _id: id,
        userId: user._id,
    }).lean();

    if (!task) return notFound();

   return (
    <div className="h-full flex flex-col p-5">

        
        <div className="flex   justify-between items-center mb-6">
            <h2 className="text-xl font-semibold border-b-2  border-[#FF6767] inline-block">
                Task Details
            </h2>

            <GoBackButton />
        </div>

        <TaskDetailClient task={JSON.parse(JSON.stringify(task))} />
    </div>
);
}