import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { PaginatedResponse } from "@/lib/types";
import type { Review } from "@/lib/supabase";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(
        1,
        parseInt(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE))
      )
    );
    const offset = (page - 1) * limit;

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    // First, get total count
    const { count, error: countError } = await supabase
      .from("reviews")
      .select("id", { count: "exact" })
      .eq("teacher_id", teacherId);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Then get paginated data
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        reviewer:reviewer_id (
          full_name,
          avatar_url
        )
      `
      )
      .eq("teacher_id", teacherId)
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: PaginatedResponse<Review> = {
      data: reviews,
      metadata: {
        total: count ?? 0,
        page,
        limit,
        hasMore: Boolean(count && offset + limit < count),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabaseClient = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { teacherId, rating, comment } = json;

    if (!teacherId || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user has already reviewed this teacher
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("teacher_id", teacherId)
      .eq("reviewer_id", user.id)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this teacher" },
        { status: 400 }
      );
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        teacher_id: teacherId,
        reviewer_id: user.id,
        rating,
        comment,
      })
      .select(
        `
        *,
        reviewer:reviewer_id (
          full_name,
          avatar_url
        )
      `
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
