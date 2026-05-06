import connectDB from "@/app/lib/db";
import { Task } from "@/app/lib/models/task";
import { getUser } from "@/app/lib/auth";

export async function getUserTasks() {
    await connectDB();

    const user = await getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const tasks = await Task.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(tasks));
}


export async function getExtremeTasks() {
    await connectDB();

    const user = await getUser();
    if (!user) return [];

    const tasks = await Task.find({
        userId: user._id,
        priority: "Extreme",
    })
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(tasks));
}

export async function getTaskById(taskId: string) {
    try {
        await connectDB();

        const user = await getUser();
        if (!user) return null;

        const task = await Task.findOne({
            _id: taskId,
            userId: user._id,
        }).lean();

        return JSON.parse(JSON.stringify(task));
    } catch (error) {
        console.log("getTaskById error:", error);
        return null;
    }
}