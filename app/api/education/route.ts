import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { TeacherEducation } from "@/lib/supabase";
import { PaginatedResponse, PaginationParams } from "@/lib/types";

// GET /api/education?teacher_id=<teacher_id>&page=<page>&limit=<limit>
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const teacherId = searchParams.get("teacher_id");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50); // Max 50 items per page
  const offset = (page - 1) * limit;

  if (!teacherId) {
    return NextResponse.json(
      { error: "Teacher ID is required" },
      { status: 400 }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from("teacher_education")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", teacherId);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Get paginated data
    const { data, error } = await supabase
      .from("teacher_education")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("year", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: PaginatedResponse<TeacherEducation> = {
      data: data as TeacherEducation[],
      metadata: {
        total: count || 0,
        page,
        limit,
        hasMore: (count || 0) > offset + limit,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teacher education" },
      { status: 500 }
    );
  }
}

// POST /api/education
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !session.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.session.user.id;
    const body = await request.json();
    const { teacher_id, degree, institution, year, description } = body;

    if (!teacher_id || !degree || !institution || !year) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify that the user owns the teacher profile
    const { data: teacherProfile, error: teacherError } = await supabase
      .from("teacher_profiles")
      .select("user_id")
      .eq("id", teacher_id)
      .single();

    if (teacherError || !teacherProfile) {
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      );
    }

    if (teacherProfile.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Insert the education
    const { data, error } = await supabase
      .from("teacher_education")
      .insert({
        teacher_id,
        degree,
        institution,
        year,
        description,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create teacher education" },
      { status: 500 }
    );
  }
}

// PUT /api/education/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "Education ID is required" },
      { status: 400 }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !session.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.session.user.id;
    const body = await request.json();
    const { degree, institution, year, description } = body;

    if (!degree && !institution && !year && !description) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Verify that the user owns the education
    const { data: education, error: educationError } = await supabase
      .from("teacher_education")
      .select("teacher_id")
      .eq("id", id)
      .single();

    if (educationError || !education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    // Verify that the user owns the teacher profile
    const { data: teacherProfile, error: teacherError } = await supabase
      .from("teacher_profiles")
      .select("user_id")
      .eq("id", education.teacher_id)
      .single();

    if (teacherError || !teacherProfile) {
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      );
    }

    if (teacherProfile.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update the education
    const updateData: Partial<TeacherEducation> = {};
    if (degree) updateData.degree = degree;
    if (institution) updateData.institution = institution;
    if (year) updateData.year = year;
    if (description !== undefined) updateData.description = description;

    const { data, error } = await supabase
      .from("teacher_education")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update teacher education" },
      { status: 500 }
    );
  }
}

// DELETE /api/education/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "Education ID is required" },
      { status: 400 }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !session.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.session.user.id;

    // Verify that the user owns the education
    const { data: education, error: educationError } = await supabase
      .from("teacher_education")
      .select("teacher_id")
      .eq("id", id)
      .single();

    if (educationError || !education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    // Verify that the user owns the teacher profile
    const { data: teacherProfile, error: teacherError } = await supabase
      .from("teacher_profiles")
      .select("user_id")
      .eq("id", education.teacher_id)
      .single();

    if (teacherError || !teacherProfile) {
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      );
    }

    if (teacherProfile.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the education
    const { error } = await supabase
      .from("teacher_education")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete teacher education" },
      { status: 500 }
    );
  }
}
