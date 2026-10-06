import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

const protectedPrefixes = [
  "/dashboard", "/myaccount", "/profile", "/settings", "/messages", "/notifications",
  "/favorites", "/matches", "/mutual-interests", "/who-likes-me", "/profile-views",
  "/photos", "/subscriptions", "/my-subscription", "/privileges", "/payments", "/search",
  "/online", "/new-members", "/health-cases", "/auto-search", "/ignored-members",
  "/safety-center", "/member",
];

const protectedApiPrefixes = [
  "/api/activity", "/api/admin", "/api/auth/session", "/api/dashboard", "/api/interactions",
  "/api/member-profile", "/api/member", "/api/messages", "/api/payments", "/api/photos",
  "/api/profile", "/api/reports", "/api/search", "/api/settings", "/api/favorites",
  "/api/matches", "/api/notifications", "/api/subscriptions", "/api/my-subscription",
  "/api/blocks", "/api/profile-view", "/api/interests",
];

const authPages = ["/login", "/signup", "/register", "/forgot-password"];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const memberId = request.cookies.get("qalbylove_session")?.value;
  const signature = request.cookies.get("qalbylove_session_sig")?.value;
  const validSession = await verifySession(memberId, signature);

  if (matchesPrefix(pathname, protectedApiPrefixes) && !validSession) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  if (matchesPrefix(pathname, protectedPrefixes) && !validSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (authPages.includes(pathname) && validSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", "/myaccount/:path*", "/profile/:path*", "/settings/:path*",
    "/messages/:path*", "/notifications/:path*", "/favorites/:path*", "/matches/:path*",
    "/mutual-interests/:path*", "/who-likes-me/:path*", "/profile-views/:path*", "/photos/:path*",
    "/subscriptions/:path*", "/my-subscription/:path*", "/privileges/:path*", "/payments/:path*",
    "/search/:path*", "/online/:path*", "/new-members/:path*", "/health-cases/:path*",
    "/auto-search/:path*", "/ignored-members/:path*", "/safety-center/:path*", "/member/:path*",
    "/login", "/signup", "/register", "/forgot-password",
    "/api/activity/:path*", "/api/admin/:path*", "/api/auth/session/:path*", "/api/dashboard/:path*",
    "/api/interactions/:path*", "/api/member-profile/:path*", "/api/member/:path*", "/api/messages/:path*",
    "/api/payments/:path*", "/api/photos/:path*", "/api/profile/:path*", "/api/reports/:path*",
    "/api/search/:path*", "/api/settings/:path*", "/api/favorites/:path*", "/api/matches/:path*",
    "/api/notifications/:path*", "/api/subscriptions/:path*", "/api/my-subscription/:path*",
    "/api/blocks/:path*", "/api/profile-view/:path*", "/api/interests/:path*",
  ],
};
