import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
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
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a Supabase client with the auth cookie
    const supabase = createRouteHandlerClient({ cookies });

    // Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      console.error("Auth error:", signUpError);
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 400 }
      );
    }

    // Create a service role client to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create profile with service role (bypassing RLS)
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

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert(profileData);

    if (profileError) {
      console.error("Profile error:", profileError);
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    // If teacher, create teacher profile
    if (userType === "teacher") {
      const teacherData: any = {
        user_id: authData.user.id,
        subject: [],
        location: "",
        fee: "",
        about: "",
        tags: [],
      };

      // Add optional teacher fields
      if (experience) teacherData.experience = experience;
      if (teachingModes) teacherData.teaching_modes = teachingModes;
      if (degree) teacherData.degree = degree;
      if (specialization) teacherData.specialization = specialization;

      const { error: teacherError } = await supabaseAdmin
        .from("teacher_profiles")
        .insert(teacherData);

      if (teacherError) {
        console.error("Teacher profile error:", teacherError);
        return NextResponse.json(
          { error: teacherError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
