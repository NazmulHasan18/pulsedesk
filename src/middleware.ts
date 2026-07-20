import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("middleware", req.nextauth);
    const token = req.nextauth.token;

    if (token?.error === "RefreshAccessTokenError") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        console.log("authorized token", token);
        const isLoggedIn = !!token;
        const { pathname } = req.nextUrl;
        console.log({ pathname });
        const isDashboardRoute = pathname.startsWith("/dashboard");
        const isPlatformRoute = pathname.startsWith("/platform");

        if (!isDashboardRoute && !isPlatformRoute) return true;
        if (!isLoggedIn) return false;

        const userType = token?.userType;
        console.log({ userType });

        // superadmin has no business in the company dashboard, and vice versa
        if (isPlatformRoute && userType !== "superadmin") return false;
        if (isDashboardRoute && userType === "superadmin") return false;
        console.log("pass the line");
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/platform/:path*"],
};
