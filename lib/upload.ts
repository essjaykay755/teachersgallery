import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Uploads an avatar image to Supabase Storage
 * @param file The file to upload
 * @param userId The user ID to associate with the file, or undefined for a temporary ID
 * @returns Object containing the URL of the uploaded file or an error
 */
export async function uploadAvatar(
  file: File,
  userId?: string
): Promise<{ url: string } | { error: string }> {
  try {
    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" };
    }

    if (file.size > 2 * 1024 * 1024) {
      return { error: "File size must be less than 2MB" };
    }

    console.log("Upload: Starting avatar upload process");

    // Generate a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${
      userId || crypto.randomUUID()
    }-${Date.now()}.${fileExt}`;
    console.log(`Upload: Generated file name: ${fileName}`);

    // Upload path
    const filePath = `${fileName}`;
    console.log(`Upload: Target path: avatars/${filePath}`);

    // Create Supabase client
    const supabase = createClientComponentClient();

    // Check if the avatars bucket exists
    try {
      console.log("Upload: Checking if avatars bucket exists");
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();

      if (bucketsError) {
        console.error("Upload: Error listing buckets:", bucketsError);
        // Continue with upload attempt even if we can't check buckets
      } else {
        const avatarsBucketExists = buckets?.some(
          (bucket) => bucket.name === "avatars"
        );

        if (!avatarsBucketExists) {
          console.log(
            "Upload: Avatars bucket does not exist, attempting to create it"
          );
          try {
            const { error: createError } = await supabase.storage.createBucket(
              "avatars",
              {
                public: true,
                fileSizeLimit: 2 * 1024 * 1024,
              }
            );

            if (createError) {
              console.error(
                "Upload: Error creating avatars bucket:",
                createError
              );

              // If we can't create the bucket, return a specific error
              if (createError.message.includes("permission denied")) {
                return {
                  error:
                    "You don't have permission to create storage buckets. Please contact an administrator.",
                };
              }

              // Continue with upload attempt even if bucket creation fails
            } else {
              console.log("Upload: Avatars bucket created successfully");
            }
          } catch (createErr) {
            console.error("Upload: Exception creating bucket:", createErr);
            // Continue with upload attempt even if bucket creation fails
          }
        } else {
          console.log("Upload: Avatars bucket exists");
        }
      }
    } catch (err) {
      console.error("Upload: Exception checking buckets:", err);
      // Continue with upload attempt even if bucket check fails
    }

    // Upload the file
    console.log("Upload: Attempting to upload file");
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload: Upload error:", uploadError);

      // Check if it's an RLS policy error
      if (
        uploadError.message.includes(
          "new row violates row-level security policy"
        )
      ) {
        return {
          error:
            "Permission denied: You don't have access to upload files. Please log out and log back in.",
        };
      }

      // Check if it's a bucket not found error
      if (uploadError.message.includes("bucket not found")) {
        return {
          error: "Storage bucket not found. Please contact an administrator.",
        };
      }

      return { error: uploadError.message };
    }

    console.log("Upload: File uploaded successfully, getting public URL");

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error("Upload: Failed to get public URL");
      return { error: "Failed to get public URL for uploaded file" };
    }

    console.log("Upload: Generated public URL:", publicUrlData.publicUrl);

    return { url: publicUrlData.publicUrl };
  } catch (error) {
    console.error("Upload: Exception in uploadAvatar:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred during upload",
    };
  }
}
