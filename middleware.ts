import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require a completed profile
const PROTECTED_ROUTES = [
  '/dashboard',
  '/messages',
  '/settings',
  '/teacher-profile',
  '/assigned-students'
];

// Routes that require authentication but not a completed profile
const AUTH_ROUTES = [
  '/onboarding'
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/legal',
  '/find-teachers',
  '/teachers',
  '/auth/login'
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Get the pathname from the URL
  const { pathname } = req.nextUrl;
  
  // Check if this is a public route that doesn't need auth
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isPublicRoute) {
    return res;
  }
  
  // Get the user's session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  // If no session, redirect to login except for auth routes
  if (!session) {
    // Allow direct access to auth-related routes for non-authenticated users
    if (pathname.startsWith('/auth/')) {
      return res;
    }
    
    // Redirect to login for all other protected routes
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Check if this is a route that requires a completed profile
  const requiresProfile = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`) 
  );
  
  if (requiresProfile) {
    // Check if the user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle();
      
    // If no profile found, redirect to onboarding
    if (!profile || profileError) {
      const redirectUrl = new URL('/onboarding', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // Allow access to the route
  return res;
}

// Define which routes should be processed by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (these should handle their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
