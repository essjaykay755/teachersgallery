import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { TeacherExperience } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get teacher_id from the query parameters
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacher_id");

  if (!teacherId) {
    return NextResponse.json(
      { error: "Teacher ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch experiences for the specified teacher
    const { data, error } = await supabase
      .from("teacher_experience")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching teacher experiences:", error);
      return NextResponse.json(
        { error: "Failed to fetch teacher experiences" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Exception in GET experience:", err);
    return NextResponse.json(
      { error: "Server error fetching experience data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received experience data:", JSON.stringify(body));
    const { title, institution, period, description } = body;

    // Validate required fields
    if (!title || !institution || !period) {
      console.log("Missing required fields:", { title, institution, period });
      return NextResponse.json(
        { error: "Title, institution, and period are required" },
        { status: 400 }
      );
    }

    // Get the teacher profile for the current user
    const { data: teacherProfile, error: teacherError } = await supabase
      .from("teacher_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    if (teacherError || !teacherProfile) {
      console.error("Error fetching teacher profile:", teacherError);
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      );
    }

    console.log("Found teacher profile:", teacherProfile.id);

    // Insert the new experience
    const { data, error } = await supabase
      .from("teacher_experience")
      .insert({
        teacher_id: teacherProfile.id,
        title,
        institution,
        period,
        description,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating teacher experience:", error);
      return NextResponse.json(
        { error: "Failed to create teacher experience", details: error },
        { status: 500 }
      );
    }

    console.log("Successfully created experience:", data.id);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Exception in POST experience:", error);
    return NextResponse.json(
      { error: "Server error processing experience request", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get experience_id from the query parameters
  const { searchParams } = new URL(request.url);
  const experienceId = searchParams.get("id");

  if (!experienceId) {
    return NextResponse.json(
      { error: "Experience ID is required" },
      { status: 400 }
    );
  }

  try {
    // Get the teacher profile for the current user
    const { data: teacherProfile, error: teacherError } = await supabase
      .from("teacher_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    if (teacherError || !teacherProfile) {
      console.error("Error fetching teacher profile:", teacherError);
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      );
    }

    // Verify that the experience belongs to the current teacher
    const { data: experience, error: experienceError } = await supabase
      .from("teacher_experience")
      .select("*")
      .eq("id", experienceId)
      .eq("teacher_id", teacherProfile.id)
      .single();

    if (experienceError || !experience) {
      console.error("Error fetching experience:", experienceError);
      return NextResponse.json(
        {
          error: "Experience not found or you don't have permission to delete it",
        },
        { status: 403 }
      );
    }

    // Delete the experience
    const { error: deleteError } = await supabase
      .from("teacher_experience")
      .delete()
      .eq("id", experienceId);

    if (deleteError) {
      console.error("Error deleting experience:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete experience" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Exception in DELETE experience:", err);
    return NextResponse.json(
      { error: "Server error deleting experience data" },
      { status: 500 }
    );
  }
}
