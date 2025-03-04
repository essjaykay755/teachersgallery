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

    // Create profile with service role (bypassing RLS)
    console.log("Creating user profile...");
    const profileData: any = {
      id: authData.user.id,
      full_name: fullName,
      email,
      user_type: userType,
      avatar_url: avatarUrl || "",
    };

    // Add optional fields based on user type
    if (phone) profileData.phone = phone;
    if (userType === "student" && grade) profileData.grade = grade;
    if (userType === "parent" && childrenCount)
      profileData.children_count = parseInt(childrenCount);

    console.log("Profile data to insert:", profileData);
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert(profileData);

    if (profileError) {
      console.error("Profile error:", profileError);
      // Log more details about the error
      if (profileError.details) {
        console.error("Profile error details:", profileError.details);
      }
      if (profileError.hint) {
        console.error("Profile error hint:", profileError.hint);
      }
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    // If teacher, create teacher profile and related records
    if (userType === "teacher") {
      console.log("Creating teacher profile...");
      const teacherData: any = {
        user_id: authData.user.id,
        subject: [],
        location: "",
        fee: "",
        about: "",
        tags: [],
      };

      console.log("Teacher data to insert:", teacherData);
      const { data: teacherProfile, error: teacherError } = await supabaseAdmin
        .from("teacher_profiles")
        .insert(teacherData)
        .select()
        .single();

      if (teacherError) {
        console.error("Teacher profile error:", teacherError);
        if (teacherError.details) {
          console.error("Teacher profile error details:", teacherError.details);
        }
        if (teacherError.hint) {
          console.error("Teacher profile error hint:", teacherError.hint);
        }
        return NextResponse.json(
          { error: teacherError.message },
          { status: 400 }
        );
      }

      // If we have education details, create an education record
      if (degree && teacherProfile) {
        console.log("Creating teacher education record...");
        const educationData = {
          teacher_id: teacherProfile.id,
          degree,
          institution: specialization || "Not specified", // Using specialization as institution if provided
          year: new Date().getFullYear().toString(), // Default to current year
          description: "", // Optional field
        };

        const { error: educationError } = await supabaseAdmin
          .from("teacher_education")
          .insert(educationData);

        if (educationError) {
          console.error("Education record error:", educationError);
          // We'll continue even if education record creation fails
        }
      }

      // If we have experience details, create an experience record
      if (experience && teacherProfile) {
        console.log("Creating teacher experience record...");
        const experienceData = {
          teacher_id: teacherProfile.id,
          title: "Teaching Experience",
          institution: "Previous Institution",
          period: experience, // Using the experience value as the period
          description: "", // Optional field
        };

        const { error: experienceError } = await supabaseAdmin
          .from("teacher_experience")
          .insert(experienceData);

        if (experienceError) {
          console.error("Experience record error:", experienceError);
          // We'll continue even if experience record creation fails
        }
      }
    }

    // Sign in the user
    const { data: signInData, error: signInError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      console.error("Sign in error:", signInError);
      // We'll still return success since the user was created
    }

    // Wait for a short delay to ensure all database operations are completed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get the complete profile data to return
    const { data: completeProfile, error: profileFetchError } =
      await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

    if (profileFetchError) {
      console.error("Error fetching complete profile:", profileFetchError);
    }

    console.log("Registration completed successfully");
    return NextResponse.json({
      success: true,
      user: authData.user,
      session: signInData?.session,
      profile: completeProfile || null,
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
