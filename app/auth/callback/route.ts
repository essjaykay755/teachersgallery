import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (!code) {
      console.error("No code present in auth callback");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Exchange the code for a session
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);

    // Get the user after exchanging code for session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error or no user found after exchanging code:", userError);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    console.log("User authenticated successfully:", user.id);

    // Create a service role client with admin privileges to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if profile exists
    console.log("Checking if profile exists for user:", user.id);
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id") // Just select the ID to minimize data transfer
      .eq("id", user.id)
      .maybeSingle(); // Using maybeSingle instead of single to avoid PGRST116 error

    // If no profile found or there was an error, redirect to onboarding
    if (!profile || profileError) {
      console.log(
        "No profile found or error, redirecting to onboarding:", 
        user.id, 
        profileError?.message || "Profile not found"
      );
      
      // Force a delay to ensure cookies are properly set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use absolute URL to ensure proper redirection
      const onboardingUrl = new URL("/onboarding", request.url);
      console.log("Redirecting to:", onboardingUrl.toString());
      return NextResponse.redirect(onboardingUrl);
    }

    // Profile exists, redirect to dashboard
    console.log("Profile found, redirecting to dashboard:", user.id);
    
    // Force a delay to ensure cookies are properly set
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Unexpected error in auth callback:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}
