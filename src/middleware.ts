import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname; // relative path

    // Manage route protection
    const token = await getToken({ req });

    const isAuth = !!token;

    const isLoginPage = req.nextUrl.pathname.startsWith("/login");
    const isRegisterPage = req.nextUrl.pathname.startsWith("/register");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    const unprotectedRoutes = ["/login", "/register", "/"];

    if (isAuth && (isLoginPage || isRegisterPage)) {
      return NextResponse.redirect(new URL(`/dashboard`, req.url));
    }

    if (!isAuth && !unprotectedRoutes.includes(pathname) && !isApiRoute) {
      return NextResponse.redirect(new URL(`/login`, req.url));
    }
  },
  {
    callbacks: {
      // Simplify the `authorized` callback
      authorized: () => true,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)", "/login", "/register", "/dashboard/:path*"],
};
