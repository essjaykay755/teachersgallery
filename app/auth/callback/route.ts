import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);

    // Check if user has a profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .single();

    // If no profile exists, redirect to onboarding
    if (!profile) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // If profile exists, redirect to dashboard
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
