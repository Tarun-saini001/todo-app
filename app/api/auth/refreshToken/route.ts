import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/app/lib/db";
import { User } from "@/app/lib/models/user";
import { cookies } from "next/headers";
import RefreshTokenModel from "@/app/lib/models/token";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            console.log(" No refresh token");
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
        let decoded: any;
       try {
            decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            );
        } catch (err: any) {
            console.log("Invalid refresh token:", err.message);
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }

        await connectDB();

        const user = await User.findById(decoded.userId);

        if (!user) {
            console.log('Invalid refresh token');
            throw new Error("Invalid refresh token");
        }

        const existingToken = await RefreshTokenModel.findOne({
            userId: decoded.userId,
            refreshToken,
        });

        if (!existingToken) {
            console.log("Refresh token not found");
            throw new Error("Invalid refresh token");
        }

        const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "7d" }
        );


        await RefreshTokenModel.findOneAndUpdate(
            { userId: user._id },
            {
                refreshToken: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            { upsert: true, new: true }
        );

        const response = NextResponse.redirect(new URL("/", req.url));

        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 15,
        });

        response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (err: any) {
        console.log('something went wrong:', err.message);

        return NextResponse.redirect(new URL("/sign-in", req.url));
    }
}