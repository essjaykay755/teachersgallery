import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Make sure id is properly awaited for dynamic routing
    const id = await Promise.resolve(params.id);
    console.log("API: Fetching teacher profile for ID:", id);

    if (!id) {
      console.error("API: Missing teacher ID in request");
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    // Simple query without timeouts or complex error handling
    const { data, error } = await supabase
      .from("teacher_profiles")
      .select(`
        *,
        profiles!user_id (
          full_name,
          email,
          avatar_url,
          gender
        )
      `)
      .eq("id", id)
      .single();
    
    if (error) {
      console.error(`API: Supabase error fetching teacher ${id}:`, error);
      
      // Provide basic error messages
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      console.error(`API: Teacher not found for ID ${id}`);
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    console.log(`API: Successfully fetched teacher ${id}`);
    return NextResponse.json({ data });
    
  } catch (error: any) {
    console.error("API: Unhandled error fetching teacher:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 