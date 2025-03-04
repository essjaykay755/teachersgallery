import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { PaginatedResponse } from "@/lib/types";
import type { TeacherProfile } from "@/lib/supabase";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");
    const location = searchParams.get("location");
    const minRating = searchParams.get("minRating");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(
        1,
        parseInt(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE))
      )
    );
    const offset = (page - 1) * limit;

    // First, get total count with filters
    let countQuery = supabase
      .from("teacher_profiles")
      .select("id", { count: "exact" });

    if (subject) {
      countQuery = countQuery.contains("subject", [subject]);
    }
    if (location) {
      countQuery = countQuery.ilike("location", `%${location}%`);
    }
    if (minRating) {
      countQuery = countQuery.gte("rating", parseFloat(minRating));
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Then get paginated data
    let query = supabase
      .from("teacher_profiles")
      .select(
        `
        *,
        profiles:user_id (
          full_name,
          email,
          avatar_url
        )
      `
      )
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (subject) {
      query = query.contains("subject", [subject]);
    }
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }
    if (minRating) {
      query = query.gte("rating", parseFloat(minRating));
    }

    const { data: teachers, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: PaginatedResponse<TeacherProfile> = {
      data: teachers,
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
    const { subject, location, fee, about, tags } = json;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_type")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.user_type !== "teacher") {
      return NextResponse.json(
        { error: "Only teachers can create profiles" },
        { status: 403 }
      );
    }

    const { data: teacherProfile, error } = await supabase
      .from("teacher_profiles")
      .insert({
        user_id: user.id,
        subject,
        location,
        fee,
        about,
        tags,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(teacherProfile);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
