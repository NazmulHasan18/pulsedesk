import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (token?.error === "RefreshAccessTokenError") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const isLoggedIn = !!token;
        const { pathname } = req.nextUrl;
        const isDashboardRoute = pathname.startsWith("/dashboard");
        const isPlatformRoute = pathname.startsWith("/platform");

        if (!isDashboardRoute && !isPlatformRoute) return true;
        if (!isLoggedIn) return false;
        // !commented for future use if need
        // const userType = token?.userType;

        // if (isPlatformRoute && userType !== "superadmin") return false;
        // if (isDashboardRoute && userType === "superadmin") return false;

        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/platform/:path*"],
};
