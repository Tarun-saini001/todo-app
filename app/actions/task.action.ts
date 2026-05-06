"use server";

import { messages } from "../constants/messages";
import { getUser } from "../lib/auth";
import connectDB from "../lib/db";
import { Task } from "../lib/models/task";


export async function deleteTask(taskId: string) {
    try {
        const user = await getUser();

        if (!user) {
            return { success: false, message: messages.UNAUTHERISED };
        }

        await connectDB();

        await Task.findOneAndDelete({
            _id: taskId,
            userId: user._id,
        });

        return { success: true, message:messages.TASK_DELETE };
    } catch (error) {
        return {
            success: false,
            message: messages.SOMETHNG_WENT_WRONG,
        };
    }
}