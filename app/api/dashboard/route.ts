import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

import { Task } from "@/app/lib/models/task";
import { messages } from "@/app/constants/messages";
import { getUser } from "@/app/lib/auth";

export async function GET() {
    try {
        await connectDB();

        const user = await getUser();
        console.log('user:oooooo ', user);

        if (!user) {
            return NextResponse.json(
                { message: messages.UNAUTHERISED },
                { status: 401 }
            );
        }

        const userId = user._id;

        
        const results = await Promise.allSettled([

            
            Task.countDocuments({ userId, status: "Completed" }),
            Task.countDocuments({ userId, status: "In-Progress" }),
            
            Task.countDocuments({ userId, status: "Not Started" }),
            
            Task.find({
                userId,
                status: { $in: ["Not Started", "In-Progress"] }
            })
                .sort({ createdAt: -1 })
                .limit(3),

            
            Task.find({
                userId,
                status: "Completed"
            })
                .sort({ updatedAt: -1 })
                .limit(2)

        ]);

        
        const [
            completedCount,
            inProgressCount,
            notStartedCount,
            pendingTasks,
            completedTasks
        ] = results.map((res) =>
            res.status === "fulfilled" ? res.value : null
        );

        return NextResponse.json({
            stats: {
                completed: completedCount || 0,
                inProgress: inProgressCount || 0,
                notStarted: notStartedCount || 0
            },
            pendingTasks: pendingTasks || [],
            completedTasks: completedTasks || []
        });

    } catch (error: any) {
        return NextResponse.json(
            {
                message: messages.SERVER_ERROR,
                error: error.message
            },
            { status: 500 }
        );
    }
}