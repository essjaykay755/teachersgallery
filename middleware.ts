import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check auth condition
  if (session?.user) {
    // If the user is signed in and trying to access auth pages, redirect them to dashboard
    if (req.nextUrl.pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } else {
    // If the user is not signed in and trying to access protected pages, redirect them to login
    if (
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/profile") ||
      req.nextUrl.pathname.startsWith("/messages")
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return res;
}

// Specify which routes to run the middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth callback route
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|auth/callback).*)",
  ],
};
