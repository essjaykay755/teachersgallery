import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { FeaturedTeacher } from "@/lib/supabase";
import { PaginatedResponse } from "@/lib/types";

// GET /api/featured?page=<page>&limit=<limit>
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50); // Max 50 items per page
  const offset = (page - 1) * limit;

  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Get total count of active featured teachers
    const now = new Date().toISOString();
    const { count, error: countError } = await supabase
      .from("featured_teachers")
      .select("*", { count: "exact", head: true })
      .gte("end_date", now);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Get paginated data with teacher profile and pricing plan
    const { data, error } = await supabase
      .from("featured_teachers")
      .select(
        `
        *,
        teacher_profile:teacher_id(
          id,
          user_id,
          subject,
          location,
          fee,
          about,
          tags,
          is_verified,
          rating,
          reviews_count,
          profiles:user_id(
            id,
            full_name,
            avatar_url
          )
        ),
        pricing_plan:plan_id(*)
      `
      )
      .gte("end_date", now)
      .order("start_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: PaginatedResponse<FeaturedTeacher> = {
      data: data as FeaturedTeacher[],
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
      { error: "Failed to fetch featured teachers" },
      { status: 500 }
    );
  }
}

// GET /api/featured/teacher/:id
export async function GET_BY_TEACHER(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const teacherId = request.nextUrl.pathname.split("/").pop();
  if (!teacherId) {
    return NextResponse.json(
      { error: "Teacher ID is required" },
      { status: 400 }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("featured_teachers")
      .select(
        `
        *,
        pricing_plan:plan_id(*)
      `
      )
      .eq("teacher_id", teacherId)
      .gte("end_date", now)
      .order("start_date", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return NextResponse.json(
          { error: "No active featured plan found for this teacher" },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch featured teacher" },
      { status: 500 }
    );
  }
}
