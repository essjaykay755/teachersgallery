import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { TeacherEducation } from "@/lib/supabase";

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

  // Fetch education for the specified teacher
  const { data, error } = await supabase
    .from("teacher_educations")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("year", { ascending: false });

  if (error) {
    console.error("Error fetching teacher education:", error);
    return NextResponse.json(
      { error: "Failed to fetch teacher education" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { degree, institution, year, description } = body;

    // Validate required fields
    if (!degree || !institution || !year) {
      return NextResponse.json(
        { error: "Degree, institution, and year are required" },
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

    // Insert the new education
    const { data, error } = await supabase
      .from("teacher_educations")
      .insert({
        teacher_id: teacherProfile.id,
        degree,
        institution,
        year,
        description,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating teacher education:", error);
      return NextResponse.json(
        { error: "Failed to create teacher education" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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

  // Get education_id from the query parameters
  const { searchParams } = new URL(request.url);
  const educationId = searchParams.get("id");

  if (!educationId) {
    return NextResponse.json(
      { error: "Education ID is required" },
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

  // Verify that the education belongs to the current teacher
  const { data: education, error: educationError } = await supabase
    .from("teacher_educations")
    .select("*")
    .eq("id", educationId)
    .eq("teacher_id", teacherProfile.id)
    .single();

  if (educationError || !education) {
    console.error("Error fetching education:", educationError);
    return NextResponse.json(
      {
        error: "Education not found or you don't have permission to delete it",
      },
      { status: 403 }
    );
  }

  // Delete the education
  const { error: deleteError } = await supabase
    .from("teacher_educations")
    .delete()
    .eq("id", educationId);

  if (deleteError) {
    console.error("Error deleting education:", deleteError);
    return NextResponse.json(
      { error: "Failed to delete education" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
