#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

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
    console.log("Adding INSERT policy for profiles table...");

    // SQL to add the INSERT policy
    const { error } = await supabase.rpc("execute_sql", {
      sql: `
        CREATE POLICY "Users can insert their own profile" 
        ON public.profiles 
        FOR INSERT 
        WITH CHECK (auth.uid() = id);
      `,
    });

    if (error) {
      if (error.message.includes("already exists")) {
        console.log("Policy already exists, skipping.");
      } else {
        throw new Error(`Failed to add policy: ${error.message}`);
      }
    } else {
      console.log("INSERT policy added successfully for profiles table");
    }

    console.log("Done!");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
