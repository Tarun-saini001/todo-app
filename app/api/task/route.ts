import { NextResponse } from "next/server";
import { getUser } from "@/app/lib/auth";
import connectDB from "@/app/lib/db";
import { taskSchema } from "@/app/validations/task";
import { Task } from "@/app/lib/models/task";
import { messages } from "@/app/constants/messages";
import uploadToCloudinary from "@/app/lib/upload";

export async function POST(req: Request) {
    try {
        await connectDB();

        const user = await getUser();

        if (!user) {
            return NextResponse.json(
                { message: messages.UNAUTHERISED },
                { status: 401 }
            );
        }


        const formData = await req.formData();
        const file = formData.get("image") as File;

        let imageUrl = "";

        if (file) {
            const uploaded: any = await uploadToCloudinary(file);
            imageUrl = uploaded.secure_url;
        }

        const body = {
            title: formData.get("title"),
            date: formData.get("date"),
            priority: formData.get("priority"),
            description: formData.get("description"),
            image: imageUrl,
        };

        const parsed = taskSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: messages.VALIDATION_ERROR, errors: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const task = await Task.create({
            ...parsed.data,
            status: "pending",
            userId: user._id,
        });

        return NextResponse.json(
            { message: messages.TASK_CREATED, Task: task },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: messages.SERVER_ERROR, error: error.message },
            { status: 500 }
        );
    }
}