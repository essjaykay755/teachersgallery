import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the bucket already exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError);
      return NextResponse.json(
        { error: "Failed to list buckets" },
        { status: 500 }
      );
    }

    const avatarsBucketExists = buckets.some(
      (bucket) => bucket.name === "avatars"
    );

    if (avatarsBucketExists) {
      return NextResponse.json({
        success: true,
        message: "Bucket already exists",
      });
    }

    // Create the bucket
    const { error: createError } = await supabase.storage.createBucket(
      "avatars",
      {
        public: true,
        fileSizeLimit: 2 * 1024 * 1024, // 2MB
      }
    );

    if (createError) {
      console.error("Error creating bucket:", createError);
      return NextResponse.json(
        { error: "Failed to create bucket" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bucket created successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
