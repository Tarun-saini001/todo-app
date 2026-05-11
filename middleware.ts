import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const secret =
    new TextEncoder().encode(
        process.env.ACCESS_TOKEN_SECRET!
    );

const refreshSecret =
    new TextEncoder().encode(
        process.env.REFRESH_TOKEN_SECRET!
    );

// export function middleware(req: NextRequest) {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     const isAuthPage =
//         req.nextUrl.pathname.startsWith("/sign-in") ||
//         req.nextUrl.pathname.startsWith("/register");

//     if (!accessToken && !isAuthPage) {
//         return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     return NextResponse.next();
// }


export async function middleware(req: NextRequest) {
    if (
        req.nextUrl.pathname.startsWith("/_next") ||
        req.headers.get("x-action")
    ) {
        return NextResponse.next();
    }
    
    console.log("reached 1");
    const accessToken =
        req.cookies.get("accessToken")?.value;

    console.log('accessToken: ', accessToken);
    const refreshToken =
        req.cookies.get("refreshToken")?.value;

    console.log('refreshToken: ', refreshToken);
    const isAuthPage =
        req.nextUrl.pathname.startsWith("/sign-in") ||
        req.nextUrl.pathname.startsWith("/sign-up");



    if (accessToken) {

        try {
            await jwtVerify(accessToken, secret);
            // jwt.verify(
            //     accessToken,
            //     process.env.ACCESS_TOKEN_SECRET!
            // );

            if (isAuthPage) {
                return NextResponse.redirect(
                    new URL("/", req.url)
                );
            }

            return NextResponse.next();

        } catch (error: any) {



            if (error.code !== "ERR_JWT_EXPIRED") {

                return NextResponse.redirect(
                    new URL("/sign-in", req.url)
                );
            }
        }
    }
    console.log("access token expired");


    if (!refreshToken) {
        console.log("no refreshToken");
        if (!isAuthPage) {
            return NextResponse.redirect(
                new URL("/sign-in", req.url)
            );
        }

        return NextResponse.next();
    }

    try {
        console.log("Entered in refresh logic");
        const { payload } =
            await jwtVerify(
                refreshToken,
                refreshSecret
            );
        // try {

        //     const decoded: any = jwt.verify(
        //         refreshToken,
        //         process.env.REFRESH_TOKEN_SECRET!
        //     );
        // } catch (error) {
        //     console.log('error: ', error);

        // }

        console.log("reached");

        // const newAccessToken = jwt.sign(
        //     { userId: decoded.userId },
        //     process.env.ACCESS_TOKEN_SECRET!,
        //     { expiresIn: "20s" }
        // );
        const newAccessToken =
            await new SignJWT({
                userId: payload.userId,
            })
                .setProtectedHeader({
                    alg: "HS256",
                })
                .setIssuedAt()
                .setExpirationTime("15m")
                .sign(secret);

        console.log("new accessToken generated");

        const response = NextResponse.next();

        response.cookies.set(
            "accessToken",
            newAccessToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 60*15,
            }
        );
        return response;

    } catch {
        console.log("Invalid refresh token");
        return NextResponse.redirect(
            new URL("/sign-in", req.url)
        );
    }
}

export const config = {
    matcher: [
        "/",
        "/my-task/:path*",
        "/vital-task/:path*",
        "/profile/:path*",
        "/add-task/:path*",
        "/sign-in",
        "/sign-up",
    ],
};