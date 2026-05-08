import connectDB from "@/app/lib/db";
import { Task } from "@/app/lib/models/task";
import { getUser } from "@/app/lib/auth";

export async function getUserTasks(search?: string) {
    await connectDB();
    
    const user = await getUser();
    
    if (!user) {
        throw new Error("Unauthorized");
    }
    console.log('search: ', search);

    let query: any = {
        userId: user._id,
    };

    if (search?.trim()) {
        query.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    console.log('query: ', query);
    const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .lean();

    console.log('tasks: ', tasks);
    return JSON.parse(JSON.stringify(tasks));
}


export async function getExtremeTasks() {
    await connectDB();

    const user = await getUser();
    if (!user) return [];

    const tasks = await Task.find({
        userId: user._id,
        priority: "Extreme",
        status: { $ne: "Completed" }
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