// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export async function middleware(req: NextRequest) {
//     const accessToken = req.cookies.get("accessToken")?.value;
//     const refreshToken = req.cookies.get("refreshToken")?.value;

//     const publicPaths = ["/sign-in", "/sign-up"];
//     if (publicPaths.includes(req.nextUrl.pathname)) {
//         return NextResponse.next();
//     }


//     if (!accessToken && !refreshToken) {
//         console.log("No tokens found");
//         return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     try {
//         jwt.verify(accessToken!, process.env.ACCESS_TOKEN_SECRET!);
//         return NextResponse.next();
//     } catch { }

//     if (!refreshToken) {
//         return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     try {
//         const decoded: any = jwt.verify(
//             refreshToken,
//             process.env.REFRESH_TOKEN_SECRET!
//         );
//         console.log("generating new token");
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
//         console.log("accesstoken generated");
//         const response = NextResponse.next();

//         response.cookies.set("accessToken", newAccessToken, {
//             httpOnly: true,
//             path: "/",
//             sameSite: "lax",
//             secure: false,
//             maxAge: 60 * 15,
//         });

//         response.cookies.set("refreshToken", newRefreshToken, {
//             httpOnly: true,
//             path: "/",
//             sameSite: "lax",
//             secure: false,
//             maxAge: 60 * 60 * 24 * 7,
//         });
//         return response;

//     } catch (err: any) {
//         console.log("Access token invalid:", err.message);
//         return NextResponse.redirect(new URL("/sign-in", req.url));
//     }
// }


// export const config = {
//     matcher: ["/((?!_next|api|sign-in|sign-up).*)"],
// };


// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//     const accessToken = req.cookies.get("accessToken")?.value;
//     const refreshToken = req.cookies.get("refreshToken")?.value;

//     const publicPaths = ["/sign-in", "/sign-up"];

//     if (publicPaths.includes(req.nextUrl.pathname)) {
//         return NextResponse.next();
//     }

//     if (!accessToken && !refreshToken) {
//         console.log("No tokens");
//         return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/((?!_next|api|sign-in|sign-up).*)"],
// };


import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;

    const isAuthPage =
        req.nextUrl.pathname.startsWith("/sign-in") ||
        req.nextUrl.pathname.startsWith("/register");

    if (!accessToken && !isAuthPage) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
}