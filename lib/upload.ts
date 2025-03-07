import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Compresses and resizes an image to reduce file size
 * @param file The original file
 * @param maxWidth The maximum width in pixels
 * @param maxHeight The maximum height in pixels
 * @param quality The quality of the compressed image (0-1)
 * @returns A Promise that resolves to the compressed File
 */
export async function compressImage(
  file: File,
  maxWidth = 500,
  maxHeight = 500,
  quality = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }
        
        // Create canvas and context
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw image on canvas with new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            
            // Create new File object with the compressed image
            const compressedFile = new File(
              [blob], 
              file.name, 
              { 
                type: 'image/jpeg', 
                lastModified: Date.now() 
              }
            );
            
            console.log(`Compressed image from ${(file.size / 1024).toFixed(2)}KB to ${(compressedFile.size / 1024).toFixed(2)}KB`);
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file for compression'));
    };
  });
}

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
      console.log("Upload: File exceeds 2MB, will attempt compression");
      try {
        file = await compressImage(file, 800, 800, 0.8);
        console.log(`Upload: Compressed file size: ${(file.size / 1024).toFixed(2)}KB`);
        
        // Double-check size after compression
        if (file.size > 2 * 1024 * 1024) {
          console.log("Upload: File still exceeds 2MB after compression, trying higher compression");
          file = await compressImage(file, 600, 600, 0.6);
          console.log(`Upload: Further compressed file size: ${(file.size / 1024).toFixed(2)}KB`);
          
          // If file is still too large, reject
          if (file.size > 2 * 1024 * 1024) {
            return { error: "File size is still too large even after compression. Please select a smaller image." };
          }
        }
      } catch (compressionError) {
        console.error("Upload: Error compressing image:", compressionError);
        return { error: "Failed to compress image. Please select a smaller image file." };
      }
    }

    console.log("Upload: Starting avatar upload process");
    console.log("Upload: User ID:", userId || "No user ID provided");

    if (!userId) {
      return { error: "User ID is required for avatar upload" };
    }

    // Generate a unique file name
    const fileExt = "jpg"; // Always use jpg for compressed images
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    console.log(`Upload: Generated file name: ${fileName}`);

    // Upload path
    const filePath = `${fileName}`;
    console.log(`Upload: Target path: avatars/${filePath}`);

    // Create Supabase client
    const supabase = createClientComponentClient();

    // Check if user is authenticated
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      console.error("Upload: Authentication error:", authError);
      return { error: "You must be logged in to upload files" };
    }
    console.log("Upload: User authenticated, session exists");

    // Upload the file directly without checking bucket (which can timeout)
    console.log("Upload: Attempting to upload file to avatars bucket");
    const uploadOptions = {
      cacheControl: "3600",
      upsert: true
    };
    console.log("Upload: Options:", uploadOptions);
    
    // Set a timeout for the upload operation
    const uploadPromise = supabase.storage
      .from("avatars")
      .upload(filePath, file, uploadOptions);
      
    const { data: uploadData, error: uploadError } = await uploadPromise;

    if (uploadError) {
      console.error("Upload: Upload error:", uploadError);
      console.error("Upload: Error message:", uploadError.message);
      
      // Check if it's an RLS policy error
      if (
        uploadError.message.includes(
          "new row violates row-level security policy"
        )
      ) {
        return {
          error:
            "Storage permission denied: RLS policy violation. Please follow the instructions in HOW_TO_FIX_STORAGE_RLS_ERROR.md to fix the storage policies.",
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
    console.log("Upload: Upload data:", uploadData);

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error("Upload: Failed to get public URL");
      return { error: "Failed to get public URL for uploaded file" };
    }

    // Ensure proper formatting of the URL
    let avatarUrl = publicUrlData.publicUrl;
    
    // Log original URL for debugging
    console.log("Upload: Original public URL:", avatarUrl);
    
    // Clean up the URL and ensure it doesn't contain any duplicate slashes (except for protocol)
    // and doesn't have trailing or leading whitespace
    avatarUrl = avatarUrl.trim().replace(/([^:])\/+/g, '$1/');
    
    console.log("Upload: Final processed URL:", avatarUrl);

    return { url: avatarUrl };
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
