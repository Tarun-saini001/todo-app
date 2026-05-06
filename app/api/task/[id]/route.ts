import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

import { getUser } from "@/app/lib/auth";
import { Task } from "@/app/lib/models/task";
import { messages } from "@/app/constants/messages";
import uploadToCloudinary from "@/app/lib/upload";
import { promises } from "dns";


export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUser();
        const { id } = await params;

        if (!user) {
            return NextResponse.json(
                { message: messages.UNAUTHERISED },
                { status: 401 }
            );
        }

        await connectDB();
        console.log('params: ', params);
        console.log('params.id: ', id);
        console.log('user._id: ', user._id);

        const task = await Task.findOne({
            _id: id,
            userId: user._id,
        }).lean();

        if (!task) {
            return NextResponse.json(
                { message: messages.TASK_NOT_FOUND },
                { status: 404 }
            );
        }

        return NextResponse.json(task);
    } catch (error) {
        console.log("get task error:", error);
        return NextResponse.json(
            { message: messages.SOMETHNG_WENT_WRONG },
            { status: 500 }
        );
    }
}


export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUser();
        const { id } = await params;

        if (!user) {
            return NextResponse.json(
                { message: messages.UNAUTHERISED },
                { status: 401 }
            );
        }

        await connectDB();

        const formData = await req.formData();

        const title = formData.get("title") as string;
        const date = formData.get("date") as string;
        const priority = formData.get("priority") as string;
        const description = formData.get("description") as string;
        const image = formData.get("image") as File | null;
        const status = formData.get("status") as string;

        let imageUrl = null;


        if (image && image.size > 0) {
            const uploaded: any = await uploadToCloudinary(image);
            imageUrl = uploaded.secure_url;
        }

        const updatedTask = await Task.findOneAndUpdate(
            {
                _id: id,
                userId: user._id,
            },
            {
                title,
                date,
                priority,
                status,
                description,
                ...(imageUrl && { image: imageUrl }),
            },
            { new: true }
        );

        if (!updatedTask) {
            return NextResponse.json(
                { message: messages.TASK_NOT_FOUND },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: messages.TASK_UPDATED,
            task: updatedTask,
        });
    } catch (error) {
        console.log("UPDATE TASK ERROR:", error);
        return NextResponse.json(
            { message: messages.SOMETHNG_WENT_WRONG },
            { status: 500 }
        );
    }
}