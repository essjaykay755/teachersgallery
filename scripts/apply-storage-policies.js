#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Missing Supabase URL or service role key");
  console.error(
    "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
  );
  process.exit(1);
}

// Create Supabase client with service role key (admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  try {
    console.log("Checking if avatars bucket exists...");

    // List all buckets
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }

    // Check if avatars bucket exists
    const avatarsBucketExists = buckets.some(
      (bucket) => bucket.name === "avatars"
    );

    if (!avatarsBucketExists) {
      console.log("Creating avatars bucket...");

      // Create avatars bucket
      const { error: createError } = await supabase.storage.createBucket(
        "avatars",
        {
          public: true,
          fileSizeLimit: 2 * 1024 * 1024, // 2MB
        }
      );

      if (createError) {
        throw new Error(
          `Failed to create avatars bucket: ${createError.message}`
        );
      }

      console.log("Avatars bucket created successfully");
    } else {
      console.log("Avatars bucket already exists");
    }

    // Apply RLS policies manually
    console.log("Applying RLS policies for storage...");

    // Create policies directly using the Supabase API

    // 1. Allow any authenticated user to view avatars (public access)
    console.log("Creating policy: Anyone can view avatars");
    try {
      const { error: policyError1 } = await supabase.rpc(
        "create_storage_policy",
        {
          name: "Anyone can view avatars",
          definition: "bucket_id = 'avatars'",
          operation: "SELECT",
          role: "authenticated",
        }
      );

      if (policyError1) {
        console.warn(
          `Warning: Error creating view policy: ${policyError1.message}`
        );
      }
    } catch (err) {
      console.warn(`Warning: Error creating view policy: ${err.message}`);
    }

    // 2. Allow authenticated users to upload their own avatars
    console.log("Creating policy: Users can upload their own avatars");
    try {
      const { error: policyError2 } = await supabase.rpc(
        "create_storage_policy",
        {
          name: "Users can upload their own avatars",
          definition: "bucket_id = 'avatars' and owner_id = auth.uid()::text",
          operation: "INSERT",
          role: "authenticated",
        }
      );

      if (policyError2) {
        console.warn(
          `Warning: Error creating upload policy: ${policyError2.message}`
        );
      }
    } catch (err) {
      console.warn(`Warning: Error creating upload policy: ${err.message}`);
    }

    // 3. Allow users to update their own avatars
    console.log("Creating policy: Users can update their own avatars");
    try {
      const { error: policyError3 } = await supabase.rpc(
        "create_storage_policy",
        {
          name: "Users can update their own avatars",
          definition: "bucket_id = 'avatars' and owner_id = auth.uid()::text",
          operation: "UPDATE",
          role: "authenticated",
        }
      );

      if (policyError3) {
        console.warn(
          `Warning: Error creating update policy: ${policyError3.message}`
        );
      }
    } catch (err) {
      console.warn(`Warning: Error creating update policy: ${err.message}`);
    }

    // 4. Allow users to delete their own avatars
    console.log("Creating policy: Users can delete their own avatars");
    try {
      const { error: policyError4 } = await supabase.rpc(
        "create_storage_policy",
        {
          name: "Users can delete their own avatars",
          definition: "bucket_id = 'avatars' and owner_id = auth.uid()::text",
          operation: "DELETE",
          role: "authenticated",
        }
      );

      if (policyError4) {
        console.warn(
          `Warning: Error creating delete policy: ${policyError4.message}`
        );
      }
    } catch (err) {
      console.warn(`Warning: Error creating delete policy: ${err.message}`);
    }

    console.log("Storage policies applied successfully");
    console.log(
      "Note: If you see warnings above, you may need to manually apply the policies through the Supabase dashboard"
    );
    console.log(
      "Instructions for manual policy creation are in STORAGE_SETUP.md"
    );
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
