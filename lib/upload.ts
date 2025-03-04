import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";

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

    console.log("Supabase client created");

    // Generate a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${
      userId || crypto.randomUUID()
    }-${Date.now()}.${fileExt}`;
    console.log(`Generated file name: ${fileName}`);

    // Upload path
    const filePath = `${fileName}`;
    console.log(`Attempting to upload file to avatars/${filePath}`);

    // Create Supabase client
    const supabase = createClientComponentClient();

    // Check if the avatars bucket exists
    try {
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();

      if (bucketsError) {
        console.error("Error listing buckets:", bucketsError);
        // Continue with upload attempt even if we can't check buckets
      } else {
        const avatarsBucketExists = buckets?.some(
          (bucket) => bucket.name === "avatars"
        );

        if (!avatarsBucketExists) {
          console.log("Avatars bucket does not exist, attempting to create it");
          try {
            const { error: createError } = await supabase.storage.createBucket(
              "avatars",
              {
                public: true,
                fileSizeLimit: 2 * 1024 * 1024,
              }
            );

            if (createError) {
              console.error("Error creating avatars bucket:", createError);
              // Continue with upload attempt even if bucket creation fails
            } else {
              console.log("Avatars bucket created successfully");
            }
          } catch (createErr) {
            console.error("Exception creating bucket:", createErr);
            // Continue with upload attempt even if bucket creation fails
          }
        }
      }
    } catch (err) {
      console.error("Exception checking buckets:", err);
      // Continue with upload attempt even if bucket check fails
    }

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);

      // Check if it's an RLS policy error
      if (
        uploadError.message.includes(
          "new row violates row-level security policy"
        )
      ) {
        return {
          error: "RLS policy error - user may not have permission to upload",
        };
      }

      return { error: uploadError.message };
    }

    console.log("Upload successful, getting public URL");

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    console.log("Generated public URL:", publicUrlData.publicUrl);

    return { url: publicUrlData.publicUrl };
  } catch (error) {
    console.error("Exception in uploadAvatar:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
