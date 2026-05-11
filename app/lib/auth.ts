import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "./db";
import { User } from "./models/user";

// export async function getUser() {
//     const cookieStore = await cookies();

//     let accessToken = cookieStore.get("accessToken")?.value;

//     if (!accessToken) {
//         await fetch("http://localhost:3000/api/auth/refresh", {
//             headers: {
//                 cookie: cookieStore.toString(),
//             },
//             cache: "no-store",
//         });

//         const updatedCookies = await cookies();
//         accessToken = updatedCookies.get("accessToken")?.value;

//         if (!accessToken) return null;
//     }

//     try {
//         const decoded: any = jwt.verify(
//             accessToken,
//             process.env.ACCESS_TOKEN_SECRET!
//         );

//         await connectDB();

//         const user = await User.findById(decoded.userId)
//             .select("-password")
//             .lean();

//         return JSON.parse(JSON.stringify(user));
//     } catch {
//         return null;
//     }
// }


export async function getUser() {

    const cookieStore = await cookies();

    const accessToken =
        cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }

    try {

        const decoded: any = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET!
        );

        await connectDB();

        const user = await User.findById(decoded.userId)
            .select("-password")
            .lean();

        return JSON.parse(JSON.stringify(user));

    } catch {

        return null;
    }
}
