// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import connectDB from "@/app/lib/db";
// import { User } from "@/app/lib/models/user";
// import { messages } from "@/app/constants/messages";

// export async function GET(req: Request) {
//     const cookieStore = await cookies();

//     const accessToken = cookieStore.get("accessToken")?.value;
//     const refreshToken = cookieStore.get("refreshToken")?.value;

//     try {

//         console.log('accessToken: ', accessToken);
//         if (accessToken) {
//             const decoded: any = jwt.verify(
//                 accessToken,
//                 process.env.ACCESS_TOKEN_SECRET!
//             );

//             await connectDB();
//             const user = await User.findById(decoded.userId).select("-password");

//             return NextResponse.json({ success: true, user });
//         }
//     } catch (err) {
//         console.error("Access token verification failed:", err);
//     }


//     if (!refreshToken) {
//         return NextResponse.json({ success: false, message: messages.TOKEN_NOT_FOUND }, { status: 401 });
//     }

//     try {
//         const decoded: any = jwt.verify(
//             refreshToken,
//             process.env.REFRESH_TOKEN_SECRET!
//         );
//         console.log('decoded: ', decoded);

//         await connectDB();
//         const user = await User.findById(decoded.userId).select("-password");
//         console.log('user: ', user);

//         if (!user) throw new Error("User not found");

//         const newAccessToken = jwt.sign(
//             { userId: user._id },
//             process.env.ACCESS_TOKEN_SECRET!,
//             { expiresIn: "15m" }
//         );

//         const response = NextResponse.json({
//             success: true,
//             user,
//         });

//         response.cookies.set("accessToken", newAccessToken, {
//             httpOnly: true,
//             path: "/",
//             secure: false,
//             sameSite: "lax",
//             maxAge: 60 * 15,
//         });

//         return response;
//     } catch {
//         return NextResponse.json({ success: false, message: messages.SOMETHNG_WENT_WRONG }, { status: 401 });
//     }
// }

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "@/app/lib/db";
import { User } from "@/app/lib/models/user";

export async function GET() {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    await connectDB();


    if (accessToken) {
        try {
            const decoded: any = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET!
            );

            const user = await User.findById(decoded.userId).select("-password");
            return NextResponse.json({ success: true, user });
        } catch {}
    }

 
    if (!refreshToken) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

   
    try {
        const decoded: any = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        );

        const user = await User.findById(decoded.userId).select("-password");

        const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
        );

        const res = NextResponse.json({ success: true, user });

        res.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15,
        });

        return res;

    } catch {
        return NextResponse.json({ success: false }, { status: 401 });
    }
}