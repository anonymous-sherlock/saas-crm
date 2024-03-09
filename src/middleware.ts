import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { env } from "./env.mjs";
import { DEFAULT_DASHBOARD_REDIRECT, ONBOARDING_REDIRECT, apiAuthPrefix, apiPrefix, authRoutes, publicRoutes } from "@routes";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const { nextUrl } = req;
    const token = req.nextauth.token;
    const isAuth = !!token;
    const companyAccount = req.nextauth.token?.company;
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isApiRoute = nextUrl.pathname.startsWith(apiPrefix);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (["/sign-in", "/sign-up"].includes(pathname)) {
      if (isAuth) { return NextResponse.redirect(new URL(DEFAULT_DASHBOARD_REDIRECT, req.url)); }
    }


    // check for user account if they are onboarded
    if (!companyAccount && !pathname.startsWith(ONBOARDING_REDIRECT)) {
      if (!isPublicRoute && !isAuthRoute && !isApiRoute) {
        return Response.redirect(new URL(ONBOARDING_REDIRECT, nextUrl));
      }
    }
    else if (companyAccount && companyAccount.id && pathname.startsWith(ONBOARDING_REDIRECT)) {
      return Response.redirect(new URL(DEFAULT_DASHBOARD_REDIRECT, nextUrl));
    }

    if (pathname.startsWith("/admin")) {
      if (isAuth) {
        if (token.role !== "ADMIN")
          return NextResponse.redirect(new URL(DEFAULT_DASHBOARD_REDIRECT, req.url));
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
      signIn: "/sign-in",
    },
    secret: env.NEXTAUTH_SECRET,
  },
);
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)", "/sign-in"],
};
