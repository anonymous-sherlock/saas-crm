import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { env } from "./lib/env.mjs";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const pathname = req.nextUrl.pathname;

    const token = req.nextauth.token;
    const isAuth = !!token;

    // console.log("Middleware executed 2");
    // console.log("pathname middleware", pathname);
    // console.log("Token:", token);
    // console.log("isAuth:", isAuth);

    if (["/login", "/register"].includes(pathname)) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (pathname.startsWith("/admin")) {
      if (isAuth) {
        if (token.role !== "ADMIN")
          return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        const protectedRoutes = ["/user", "/dashboard", "/leads", "/admin", "/campaigns", "/products"];
        if (!!token === false && protectedRoutes.includes(pathname)) {
          return false;
        }
        return true;
      },
    },

    pages: {
      signIn: "/login",
    },
    secret: env.NEXTAUTH_SECRET,
  },
);
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)", "/login"],
};
