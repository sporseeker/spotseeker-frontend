import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { Session } from "next-auth";

const authRoutes = [
  ,
  // /^\/$/, // Root path
  // /^\/auth\/login$/, // Exact match for /auth/login
  // /^\/auth\/register$/, // Exact match for /auth/register
  // /^\/auth\/signin\/.*$/, // Exact match for /auth/signin/*
  // /^\/event(\/(?!checkout)[^/]+)*$/, // Matches /public/* but excludes /public/*/checkout
  /^\/my-account\/.*$/, // Exact match for /my-account/*
  /^\/my-account$/, // Exact match for /auth/register
  // /^\/event\/[^/]+\/checkout$/,
];
const nonAuthRoutes = [/^\/auth\/.*$/];

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  if (pathname.includes("/auth/verify")) {
    if (
      isAuthenticated &&
      (req.auth as Session).user?.phone_no &&
      !(req.auth as Session).user?.verified
    ) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }
  const isAuthRoute = authRoutes.some((pattern) => pattern?.test(pathname));

  if (isAuthRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  const isNonAuthRoute = nonAuthRoutes.some((pattern) =>
    pattern?.test(pathname),
  );

  if (isNonAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|images|public|icons).*)",
  ],
};
