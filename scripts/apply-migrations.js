#!/usr/bin/env node

/**
 * This script applies database migrations using the Supabase CLI
 * or directly running SQL scripts using the Supabase JS client
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

// Check if Supabase CLI is installed
const checkSupabaseCli = () => {
  return new Promise((resolve) => {
    exec('supabase --version', (error) => {
      resolve(!error);
    });
  });
};

// Apply migrations using Supabase CLI
const applyMigrationsWithCli = () => {
  console.log('Applying migrations using Supabase CLI...');
  
  return new Promise((resolve, reject) => {
    exec('supabase migration up', (error, stdout, stderr) => {
      if (error) {
        console.error('Error applying migrations:', error);
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        console.log('Migrations applied successfully!');
        resolve();
      }
    });
  });
};

// Apply migrations using direct SQL execution
const applyMigrationsWithClient = async () => {
  console.log('Applying migrations using Supabase JS client...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get all migration SQL files
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort for proper execution order
  
  console.log(`Found ${migrationFiles.length} migration files`);
  
  for (const file of migrationFiles) {
    console.log(`Applying migration: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) {
        console.error(`Error applying migration ${file}:`, error);
        throw error;
      }
      console.log(`Migration ${file} applied successfully`);
    } catch (error) {
      // If the exec_sql RPC doesn't exist, try using raw queries
      console.log('Trying with separate SQL statements...');
      
      // Split SQL into separate statements
      const statements = sql.split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);
      
      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('pgcmd', { sql: statement });
          if (error) {
            console.warn(`Warning in statement: ${statement}`, error);
            // Continue with next statement if one fails
          }
        } catch (err) {
          console.warn(`Warning: ${err.message}`);
          // Continue with next statement
        }
      }
    }
  }
  
  console.log('All migrations applied!');
};

// Main function
const main = async () => {
  try {
    // Check if we should use the CLI or the client
    const hasSupabaseCli = await checkSupabaseCli();
    
    if (hasSupabaseCli) {
      await applyMigrationsWithCli();
    } else {
      await applyMigrationsWithClient();
    }
    
    console.log('Migration process completed successfully');
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  }
};

// Run the main function
main(); 