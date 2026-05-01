import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "./db";
import { User } from "./models/user";
// import { messages } from "../constants/messages";

// export async function getCurrentUser() {
//     const cookieStore = await cookies();
//     console.log('cookieStore: ', cookieStore);
//     let accessToken = cookieStore.get("accessToken")?.value;
//     const refreshToken = cookieStore.get("refreshToken")?.value;


//     if (!accessToken && !refreshToken) {
//         return {
//             Success: false,
//             message: messages.TOKEN_NOT_FOUND
//         }
//     }
//     if (accessToken) {
//         try {
//             const decoded: any = jwt.verify(
//                 accessToken,
//                 process.env.ACCESS_TOKEN_SECRET!
//             );

//             await connectDB();
//             const user = await User.findById(decoded.userId).select("-password");
//             if (!user) {
//                 return {
//                     Success: false,
//                     message: messages.UNAUTHERISED
//                 }
//             }
//             return {
//                 Success: true,
//                 message: messages.FETCH_USER_SUCCESS,
//                 data: user
//             }

//         } catch (err) {
//             console.log("Access token expired, trying refresh...");

//         }
//     }


//     if (!refreshToken) {
//         return {
//             Success: false,
//             message: messages.UNAUTHERISED
//         }
//     }

//     try {
//         const decoded: any = jwt.verify(
//             refreshToken,
//             process.env.REFRESH_TOKEN_SECRET!
//         );

//         const newAccessToken = jwt.sign(
//             { userId: decoded.userId },
//             process.env.ACCESS_TOKEN_SECRET!,
//             { expiresIn: "15m" }
//         );
//         const newRefreshToken = jwt.sign(
//             { userId: decoded.userId },
//             process.env.REFRESH_TOKEN_SECRET!,
//             { expiresIn: "7d" }
//         );


//         cookieStore.set("accessToken", newAccessToken, {
//             httpOnly: true,
//             maxAge: 60 * 15,
//             path: "/",
//             sameSite: "lax",
//             secure: false,
//         });

//         cookieStore.set("refreshToken", newRefreshToken, {
//             httpOnly: true,
//             path: "/",
//             sameSite: "lax",
//             secure: false,
//             maxAge: 60 * 60 * 24 * 7,
//         });

//         await connectDB();
//         const user = await User.findById(decoded.userId).select("-password");

//         if (!user) {
//             return {
//                 Success: false,
//                 message: messages.UNAUTHERISED
//             }
//         }
//         return {
//             Success: true,
//             message: messages.FETCH_USER_SUCCESS,
//             data: user
//         }
//     } catch (err: any) {
//         console.log("Refresh token invalid");
//         return {
//             Success: false,
//             message: messages.UNAUTHERISED
//         }
//     }
// }


// app/lib/auth.ts
// export async function getCurrentUser() {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("accessToken")?.value;

//     if (!token) return null;

//     const decoded: any = jwt.verify(
//                 token,
//                 process.env.ACCESS_TOKEN_SECRET!
//             );

//             await connectDB();
//             const user = await User.findById(decoded.userId).select("-password");

//     return user;
// }


// export async function getCurrentUser() {
//     const cookieStore = await cookies();

//     const accessToken = cookieStore.get("accessToken")?.value;
//     const refreshToken = cookieStore.get("refreshToken")?.value;

    
//     if (!accessToken && !refreshToken) {
//         console.log("Tokens not found");
//         return null;
//     }


//     if (accessToken) {
//         try {
//             const decoded: any = jwt.verify(
//                 accessToken,
//                 process.env.ACCESS_TOKEN_SECRET!
//             );

//             await connectDB();
//             const user = await User.findById(decoded.userId).select("-password");

//             return JSON.parse(JSON.stringify(user))
//         } catch {
//             console.log("Failed to get current user");
//             return null
//         }
//     }


//     // if (!refreshToken) {
//     //     console.log("Refresh token not fouund");
//     //     return null;
//     // }

   
//     // try {
//     //     const decoded: any = jwt.verify(
//     //         refreshToken,
//     //         process.env.REFRESH_TOKEN_SECRET!
//     //     );

//     //     await connectDB();
//     //     const user = await User.findById(decoded.userId).select("-password");

//     //     if (!user) return null;

       
//     //     const newAccessToken = jwt.sign(
//     //         { userId: user._id },
//     //         process.env.ACCESS_TOKEN_SECRET!,
//     //         { expiresIn: "15m" }
//     //     );

        
//     //     cookieStore.set("accessToken", newAccessToken, {
//     //         httpOnly: true,
//     //         path: "/",
//     //         maxAge: 60 * 15,
//     //     });
//     //     console.log("access and refresh tokens generated");
//     //     return JSON.parse(JSON.stringify(user))

//     // } catch (err : any){
//     //     console.log('err: ', err);
//     //     return null;
//     // }
// }




export async function getCurrentUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return null;

    try {
        const decoded: any = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET!
        );

        await connectDB();

        const user = await User.findById(decoded.userId).select("-password");

        return JSON.parse(JSON.stringify(user));
    } catch {
        return null;
    }
}



export async function getUser() {
    const cookieStore = await cookies();

    const res = await fetch("http://localhost:3000/api/auth/me", {
        cache: "no-store",
        headers: {
            cookie: cookieStore.toString(),
        },
    });

    if (res.status === 401) return null;

    const data = await res.json();
    return data.user;
}