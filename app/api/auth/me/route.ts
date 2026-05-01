import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "@/app/lib/db";
import { User } from "@/app/lib/models/user";
import { messages } from "@/app/constants/messages";

export async function GET() {
    const cookieStore = await cookies();

    let accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;


    if (!accessToken && !refreshToken) {
        return NextResponse.json({ success: false, message: messages.TOKEN_NOT_FOUND }, { status: 401 });
    }


    if (accessToken) {
        try {
            const decoded: any = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET!
            );

            await connectDB();
            const user = await User.findById(decoded.userId)
                .select("-password")
                .lean();
            const safeUser = {
                ...user,
                _id: user._id.toString(),
                createdAt: user.createdAt?.toISOString(),
                updatedAt: user.updatedAt?.toISOString(),
            };
            return NextResponse.json({ success: true, message: messages.FETCH_USER_SUCCESS, user: safeUser });

        } catch {

        }
    }


    if (!refreshToken) {
        return NextResponse.json({ success: false, message: messages.UNAUTHERISED }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        );


        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
        );

        const response = NextResponse.json({ success: true });

        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            maxAge: 60 * 15,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        await connectDB();
        const user = await User.findById(decoded.userId)
            .select("-password")
            .lean();
        const safeUser = {
            ...user,
            _id: user._id.toString(),
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString(),
        };

        return NextResponse.json({ success: true, message: messages.FETCH_USER_SUCCESS, user: safeUser }, {
            headers: response.headers
        });

    } catch (err: any) {
        console.log('failed to fetch user: ', err.message);
        return NextResponse.json({ success: false, message: err.message }, { status: 401 });
    }
}