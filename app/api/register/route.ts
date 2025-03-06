import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Helper function to wait for user record to be available
async function waitForUserRecord(
  supabaseAdmin: any,
  userId: string,
  maxAttempts = 5
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Attempt ${i + 1}: Checking if user ${userId} exists...`);
    try {
      // Try to get the user directly from auth.users
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(
        userId
      );

      if (error) {
        console.error(`Attempt ${i + 1} error:`, error);
        // If we get a 404, the user doesn't exist yet
        if (error.status === 404) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        // For other errors, we should stop trying
        return false;
      }

      if (data?.user) {
        console.log("User found:", data.user.id);
        return true;
      }
    } catch (err) {
      console.error(`Attempt ${i + 1} failed:`, err);
    }
    console.log(`User not found, waiting 1 second before retry...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  console.error(`Failed to find user after ${maxAttempts} attempts`);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log("Registration request body:", {
      ...body,
      password: "[REDACTED]", // Don't log the password
    });

    const {
      email,
      password,
      fullName,
      userType,
      phone,
      avatarUrl,
      // Teacher specific fields
      experience,
      teachingModes,
      degree,
      specialization,
      // Student specific fields
      grade,
      // Parent specific fields
      childrenCount,
    } = body;

    // Validate required fields
    if (!email || !password || !fullName || !userType) {
      console.error("Missing required fields:", {
        hasEmail: !!email,
        hasPassword: !!password,
        hasFullName: !!fullName,
        hasUserType: !!userType,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a service role client to bypass RLS
    console.log("Creating admin client...");
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

    // Sign up the user with admin client to bypass email confirmation
    console.log("Attempting to sign up user with email:", email);
    const { data: authData, error: signUpError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          user_type: userType,
          needs_onboarding: true,
          registration_data: {
            phone,
            experience,
            teachingModes,
            degree,
            specialization,
            grade,
            childrenCount,
          },
        },
      });

    if (signUpError) {
      console.error("Auth error:", signUpError);
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    if (!authData.user) {
      console.error("No user data returned from sign up");
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 400 }
      );
    }

    console.log("User created successfully:", authData.user.id);

    // Wait for user record to be available
    console.log("Waiting for user record to be available...");
    const userExists = await waitForUserRecord(supabaseAdmin, authData.user.id);
    if (!userExists) {
      console.error("User record not found after waiting");
      return NextResponse.json(
        { error: "Failed to verify user creation" },
        { status: 400 }
      );
    }

    // Create a route handler client to set cookies
    const supabaseRouteHandler = createRouteHandlerClient({ cookies });

    // Sign in the user and set cookies
    const { data: signInData, error: signInError } =
      await supabaseRouteHandler.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      console.error("Sign in error:", signInError);
      // We'll still return success since the user was created
    }

    console.log("Registration completed successfully");
    return NextResponse.json({
      success: true,
      user: authData.user,
      session: signInData?.session,
      isNewUser: true,
      redirectTo: "/onboarding",
    });
  } catch (error) {
    console.error("Registration error:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
