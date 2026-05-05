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