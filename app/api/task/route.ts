import { NextResponse } from "next/server";
import { getUser } from "@/app/lib/auth";
import connectDB from "@/app/lib/db";
import { taskSchema } from "@/app/validations/task";
import { Task } from "@/app/lib/models/task";

export async function POST(req: Request) {
    try {
        await connectDB();

        const user = await getUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        
        const body = await req.json();

      
        const parsed = taskSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: "Validation error", errors: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { title, date, priority, description, image } = parsed.data;

       
        const task = await Task.create({
            title,
            date,
            priority,
            description,
            image,
            status: "pending",
            userId: user._id,
        });

        return NextResponse.json(
            { message: "Task created successfully", Task:task },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}