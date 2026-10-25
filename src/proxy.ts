
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    const isAuthRoute = [
        "/sign-in",
        "/sign-up",
        "/verify",
    ].some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    );

    if (token && (isAuthRoute || pathname === "/")) {
        return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
    }

    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(
            new URL("/sign-in", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/sign-in/:path*",
        "/sign-up/:path*",
        "/verify/:path*",
        "/dashboard/:path*",
    ],
};
