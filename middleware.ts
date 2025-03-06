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

    // Special routes with custom handling
    const onboardingRoute = "/onboarding";

    const isProtectedRoute = protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );
    const isOnboardingRoute = req.nextUrl.pathname.startsWith(onboardingRoute);

    // Force a user to login if trying to access a protected route
    if (!session && isProtectedRoute) {
      // Store the original URL to redirect back after login
      const redirectUrl = new URL("/auth/login", req.url);
      redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If logged in, check if user has a profile
    if (session) {
      // Check if user needs onboarding from metadata
      const needsOnboarding = session.user.user_metadata?.needs_onboarding === true;
      
      // Check if user has a profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id)
        .single();

      // If no profile found and not already on onboarding page, redirect to onboarding
      if ((needsOnboarding || !profile) && !isOnboardingRoute) {
        console.log("User needs onboarding, redirecting to onboarding");
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }

      // If has profile and trying to access auth routes, redirect to dashboard
      if (profile && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // If has profile and trying to access onboarding, redirect to dashboard
      if (profile && !needsOnboarding && isOnboardingRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Handle onboarding route - allow access even if logged in
    // Specific checks for profiles are handled above
    if (isOnboardingRoute && !session) {
      // If trying to access onboarding but not logged in, redirect to login
      const redirectUrl = new URL("/auth/login", req.url);
      redirectUrl.searchParams.set("redirectTo", "/onboarding");
      return NextResponse.redirect(redirectUrl);
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
     * - public folder files (images, etc.)
     * - auth callback route
     */
    "/((?!_next/static|_next/image|favicon.ico|default-avatar.png|images/|avatars/|public/|auth/callback).*)",
  ],
};
