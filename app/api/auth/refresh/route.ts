
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "@/app/lib/db";
import RefreshTokenModel from "@/app/lib/models/token";

export async function GET() {
    const cookieStore =await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        );

        await connectDB();

        const tokenExists = await RefreshTokenModel.findOne({ refreshToken });

        if (!tokenExists) {
            throw new Error("Invalid token");
        }

        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
        );

        const res = NextResponse.json({ success: true });

        res.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure:false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
        });

        return res;
    } catch {
        return NextResponse.json({ message: "Refresh failed" }, { status: 401 });
    }
}