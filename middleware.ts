import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Refresh the session if it exists
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Middleware auth error:", error);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Protected routes that require authentication
    const protectedRoutes = [
      "/dashboard",
      "/account",
      "/settings",
      "/messages",
      "/profile",
    ];

    // Auth routes that should redirect to dashboard if logged in
    const authRoutes = ["/auth/login", "/auth/signup", "/login"];

    const isProtectedRoute = protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );

    if (!session && isProtectedRoute) {
      // Store the original URL to redirect back after login
      const redirectUrl = new URL("/auth/login", req.url);
      redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
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
