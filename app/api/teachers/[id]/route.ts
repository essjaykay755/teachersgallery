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

    // Add a timeout for the Supabase query with increased duration
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // Increased to 45 seconds timeout
    
    try {
      // First, do a quick check if the teacher exists before fetching all details
      const { data: teacherExists, error: existsError } = await supabase
        .from("teacher_profiles")
        .select("id")
        .eq("id", id)
        .maybeSingle();
      
      if (existsError) {
        console.error(`API: Error checking if teacher ${id} exists:`, existsError);
        // Continue anyway since this is just a pre-check
      } else if (!teacherExists) {
        clearTimeout(timeoutId);
        console.error(`API: Teacher not found for ID ${id} during pre-check`);
        return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      }

      // Use more detailed logging for performance tracking
      console.time(`api-teacher-fetch-${id}`);
      
      // Then get the full profile data
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
      
      console.timeEnd(`api-teacher-fetch-${id}`);
      clearTimeout(timeoutId);

      if (error) {
        console.error(`API: Supabase error fetching teacher ${id}:`, error);
        let statusCode = 500;
        let errorMessage = error.message;
        
        // Provide more specific error messages based on Postgres error codes
        if (error.code === "PGRST116") {
          statusCode = 404;
          errorMessage = "Teacher not found";
        } else if (error.code === "PGRST103") {
          statusCode = 400;
          errorMessage = "Invalid teacher ID format";
        }
        
        return NextResponse.json({ error: errorMessage }, { status: statusCode });
      }

      if (!data) {
        console.error(`API: Teacher not found for ID ${id}`);
        return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      }

      // Add diagnostic info in the response during this troubleshooting phase
      const responseData = {
        data,
        _debug: {
          timestamp: new Date().toISOString(),
          queryTime: process.env.NODE_ENV === 'development' ? `See server logs for api-teacher-fetch-${id} timer` : undefined
        }
      };

      console.log(`API: Successfully fetched teacher ${id}`);
      return NextResponse.json(responseData);
    } catch (queryError: any) {
      clearTimeout(timeoutId);
      if (queryError.name === 'AbortError') {
        console.error(`API: Supabase query timed out for teacher ${id}`);
        return NextResponse.json(
          { error: "Request timed out. Please try again.", _debug: { errorType: "timeout" } },
          { status: 504 }
        );
      }
      throw queryError;
    }
  } catch (error: any) {
    console.error("API: Unhandled error fetching teacher:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error?.message || "Unknown error occurred",
        _debug: process.env.NODE_ENV === 'development' ? { 
          errorName: error?.name,
          errorStack: error?.stack?.split('\n')[0]
        } : undefined
      },
      { status: 500 }
    );
  }
} 