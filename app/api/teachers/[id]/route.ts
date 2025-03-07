import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("API: Fetching teacher profile for ID:", id);

    if (!id) {
      console.error("API: Missing teacher ID in request");
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    // Add a timeout for the Supabase query
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
    
    try {
      const { data, error } = await supabase
        .from("teacher_profiles")
        .select(`
          *,
          profiles!user_id (
            full_name,
            email,
            avatar_url
          )
        `)
        .eq("id", id)
        .single();
      
      clearTimeout(timeoutId);

      if (error) {
        console.error(`API: Supabase error fetching teacher ${id}:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data) {
        console.error(`API: Teacher not found for ID ${id}`);
        return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      }

      console.log(`API: Successfully fetched teacher ${id}`);
      return NextResponse.json({ data });
    } catch (queryError: any) {
      clearTimeout(timeoutId);
      if (queryError.name === 'AbortError') {
        console.error(`API: Supabase query timed out for teacher ${id}`);
        return NextResponse.json(
          { error: "Request timed out" },
          { status: 504 }
        );
      }
      throw queryError;
    }
  } catch (error) {
    console.error("API: Error fetching teacher:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 