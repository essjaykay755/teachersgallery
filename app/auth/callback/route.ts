import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      await supabase.auth.exchangeCodeForSession(code);

      // Check if user has a profile
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("No user found after exchanging code for session");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Create a service role client to bypass RLS
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
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code === "PGRST116") {
        // Profile doesn't exist, redirect to onboarding
        console.log("No profile found, redirecting to onboarding:", user.id);
        return NextResponse.redirect(new URL("/onboarding", request.url));
      } else if (profileError) {
        console.error("Error fetching profile:", profileError);
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // If profile exists, redirect to dashboard
      console.log("Profile found, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If no code is present, redirect to login
    console.error("No code present in callback");
    return NextResponse.redirect(new URL("/login", request.url));
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
