import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { TeacherExperience } from "@/lib/supabase";
import { PaginatedResponse, PaginationParams } from "@/lib/types";

// GET /api/experience?teacher_id=<teacher_id>&page=<page>&limit=<limit>
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
      .from("teacher_experience")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", teacherId);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Get paginated data
    const { data, error } = await supabase
      .from("teacher_experience")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: PaginatedResponse<TeacherExperience> = {
      data: data as TeacherExperience[],
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
      { error: "Failed to fetch teacher experience" },
      { status: 500 }
    );
  }
}

// POST /api/experience
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
    const { teacher_id, title, institution, period, description } = body;

    if (!teacher_id || !title || !institution || !period) {
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

    // Insert the experience
    const { data, error } = await supabase
      .from("teacher_experience")
      .insert({
        teacher_id,
        title,
        institution,
        period,
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
      { error: "Failed to create teacher experience" },
      { status: 500 }
    );
  }
}

// PUT /api/experience/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "Experience ID is required" },
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
    const { title, institution, period, description } = body;

    if (!title && !institution && !period && !description) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Verify that the user owns the experience
    const { data: experience, error: experienceError } = await supabase
      .from("teacher_experience")
      .select("teacher_id")
      .eq("id", id)
      .single();

    if (experienceError || !experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    // Verify that the user owns the teacher profile
    const { data: teacherProfile, error: teacherError } = await supabase
      .from("teacher_profiles")
      .select("user_id")
      .eq("id", experience.teacher_id)
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

    // Update the experience
    const updateData: Partial<TeacherExperience> = {};
    if (title) updateData.title = title;
    if (institution) updateData.institution = institution;
    if (period) updateData.period = period;
    if (description !== undefined) updateData.description = description;

    const { data, error } = await supabase
      .from("teacher_experience")
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
      { error: "Failed to update teacher experience" },
      { status: 500 }
    );
  }
}

// DELETE /api/experience/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "Experience ID is required" },
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

    // Verify that the user owns the experience
    const { data: experience, error: experienceError } = await supabase
      .from("teacher_experience")
      .select("teacher_id")
      .eq("id", id)
      .single();

    if (experienceError || !experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    // Verify that the user owns the teacher profile
    const { data: teacherProfile, error: teacherError } = await supabase
      .from("teacher_profiles")
      .select("user_id")
      .eq("id", experience.teacher_id)
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

    // Delete the experience
    const { error } = await supabase
      .from("teacher_experience")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete teacher experience" },
      { status: 500 }
    );
  }
}
