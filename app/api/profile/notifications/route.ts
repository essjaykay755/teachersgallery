import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function PUT(request: Request) {
  try {
    console.log("Notification preferences API: Request received");
    
    const supabaseClient = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.log("Notification preferences API: Authentication error", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Notification preferences API: User authenticated", user.id);
    
    const json = await request.json();
    const { notification_preferences } = json;

    if (!notification_preferences) {
      console.log("Notification preferences API: Missing notification_preferences in request");
      return NextResponse.json(
        { error: "notification_preferences is required" }, 
        { status: 400 }
      );
    }

    // Check if column exists by attempting to select it
    try {
      console.log("Notification preferences API: Checking if column exists");
      const { data: columnCheck, error: columnError } = await supabase
        .from("profiles")
        .select("notification_preferences")
        .limit(1);
      
      if (columnError) {
        console.log("Notification preferences API: Column check error", columnError);
        // If we get a column-related error, the column doesn't exist
        if (columnError.message?.includes("column") && 
            columnError.message?.includes("notification_preferences")) {
          
          // Try to add the column
          try {
            console.log("Notification preferences API: Attempting to add column");
            // Use raw SQL to add the column
            const { error: alterError } = await supabase.rpc('alter_profiles_add_notification_prefs');
            
            if (alterError) {
              console.log("Notification preferences API: Failed to add column", alterError);
              return NextResponse.json(
                { 
                  error: "Failed to add notification_preferences column", 
                  details: alterError.message,
                  suggestion: "Please run the database fix script from HOW_TO_FIX_PROFILE_TIMEOUT.md"
                }, 
                { status: 500 }
              );
            }
            
            console.log("Notification preferences API: Column added successfully");
          } catch (addColumnError) {
            console.log("Notification preferences API: Add column exception", addColumnError);
            return NextResponse.json(
              { 
                error: "Database operation failed", 
                details: addColumnError instanceof Error ? addColumnError.message : "Unknown error",
                suggestion: "Please run the database fix script from HOW_TO_FIX_PROFILE_TIMEOUT.md"
              }, 
              { status: 500 }
            );
          }
        } else {
          // Some other database error
          return NextResponse.json(
            { error: columnError.message }, 
            { status: 500 }
          );
        }
      }
    } catch (columnCheckError) {
      console.log("Notification preferences API: Column check exception", columnCheckError);
      // Continue anyway, the update will fail if the column doesn't exist
    }

    // Try to update the profile with the notification preferences
    console.log("Notification preferences API: Updating profile", { user_id: user.id });
    const { data, error } = await supabase
      .from("profiles")
      .update({
        notification_preferences
      })
      .eq("id", user.id)
      .select();

    if (error) {
      console.log("Notification preferences API: Update error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Notification preferences API: Update successful");
    return NextResponse.json(data || { success: true });
  } catch (error) {
    console.log("Notification preferences API: Uncaught exception", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
} 