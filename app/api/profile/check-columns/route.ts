import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  try {
    console.log("Profile columns check API: Request received");
    
    const supabaseClient = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.log("Profile columns check API: Authentication error", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Profile columns check API: User authenticated", user.id);

    // Check which columns are missing
    const { data: columnStatus, error: columnCheckError } = await supabase.rpc(
      'check_profiles_missing_columns'
    );

    if (columnCheckError) {
      console.log("Profile columns check API: Error checking columns", columnCheckError);
      return NextResponse.json(
        { 
          error: "Failed to check columns", 
          details: columnCheckError.message,
          suggestion: "Please run the database fix script from HOW_TO_FIX_PROFILE_TIMEOUT.md"
        }, 
        { status: 500 }
      );
    }

    console.log("Profile columns check API: Column status", columnStatus);

    const fixes = [];

    // Try to fix each missing column
    if (columnStatus && !columnStatus.notification_preferences) {
      console.log("Profile columns check API: Adding notification_preferences column");
      const { data: notifResult, error: notifError } = await supabase.rpc(
        'alter_profiles_add_notification_prefs'
      );

      if (notifError) {
        console.log("Profile columns check API: Error adding notification_preferences", notifError);
      } else {
        fixes.push("notification_preferences");
        console.log("Profile columns check API: notification_preferences column added");
      }
    }

    if (columnStatus && !columnStatus.updated_at) {
      console.log("Profile columns check API: Adding updated_at column");
      const { data: updatedAtResult, error: updatedAtError } = await supabase.rpc(
        'alter_profiles_add_updated_at'
      );

      if (updatedAtError) {
        console.log("Profile columns check API: Error adding updated_at", updatedAtError);
      } else {
        fixes.push("updated_at");
        console.log("Profile columns check API: updated_at column added");
      }
    }

    // Check column status again
    const { data: updatedStatus, error: updatedCheckError } = await supabase.rpc(
      'check_profiles_missing_columns'
    );

    if (updatedCheckError) {
      console.log("Profile columns check API: Error checking updated columns", updatedCheckError);
    }

    return NextResponse.json({
      before: columnStatus,
      after: updatedStatus || columnStatus,
      fixes_applied: fixes,
      message: fixes.length > 0 
        ? `Fixed the following columns: ${fixes.join(', ')}` 
        : "No fixes were needed or could be applied"
    });
  } catch (error) {
    console.log("Profile columns check API: Uncaught exception", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
} 