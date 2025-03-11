/**
 * Fix Avatar URLs Script
 * 
 * This script checks all avatar URLs in the database and fixes common issues:
 * 1. Removes extra whitespace
 * 2. Fixes duplicate slashes
 * 3. Ensures proper URL formatting
 * 4. Adds cache busters to prevent caching issues
 * 
 * Usage:
 * 1. Make sure you're logged in to Supabase CLI
 * 2. Run: node scripts/fix-avatar-urls.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fix a Supabase avatar URL
 */
function fixAvatarUrl(url) {
  if (!url) return null;
  
  // Trim whitespace
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;
  
  // Handle default avatar
  if (
    trimmedUrl === '@default-avatar.png' ||
    trimmedUrl === '/default-avatar.png' ||
    trimmedUrl.includes('default-avatar')
  ) {
    return '/default-avatar.png';
  }
  
  try {
    // Try to parse and fix the URL
    const parsedUrl = new URL(trimmedUrl);
    
    // Ensure https protocol
    if (parsedUrl.protocol !== 'https:') {
      parsedUrl.protocol = 'https:';
    }
    
    // Fix path
    let path = parsedUrl.pathname;
    path = path.replace(/([^:])\/+/g, '$1/');
    parsedUrl.pathname = path;
    
    // Remove any existing cache busters
    parsedUrl.searchParams.delete('_cb');
    
    // Return fixed URL
    return parsedUrl.toString();
  } catch (error) {
    console.warn(`Failed to parse URL: ${trimmedUrl}`, error.message);
    
    // Basic fixes if URL parsing fails
    let fixedUrl = trimmedUrl;
    
    // Fix protocol
    if (fixedUrl.startsWith('http:')) {
      fixedUrl = 'https:' + fixedUrl.substring(5);
    }
    
    // Fix double slashes
    fixedUrl = fixedUrl.replace(/([^:])\/+/g, '$1/');
    
    return fixedUrl;
  }
}

async function fixAvatarUrls() {
  console.log('Avatar URL Fixer - Starting...');
  
  try {
    // Get all profiles with avatar URLs
    console.log('Fetching profiles with avatar URLs...');
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, avatar_url')
      .not('avatar_url', 'is', null)
      .not('avatar_url', 'eq', '');
      
    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }
    
    console.log(`Found ${profiles.length} profiles with avatar URLs`);
    
    // Track statistics
    const stats = {
      total: profiles.length,
      fixed: 0,
      unchanged: 0,
      errors: 0
    };
    
    // Process each profile
    for (const profile of profiles) {
      try {
        const originalUrl = profile.avatar_url;
        const fixedUrl = fixAvatarUrl(originalUrl);
        
        if (fixedUrl && fixedUrl !== originalUrl) {
          console.log(`Fixing URL for user ${profile.id}:`);
          console.log(`  Original: ${originalUrl}`);
          console.log(`  Fixed:    ${fixedUrl}`);
          
          // Update the profile
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: fixedUrl })
            .eq('id', profile.id);
            
          if (updateError) {
            console.error(`Error updating profile ${profile.id}: ${updateError.message}`);
            stats.errors++;
          } else {
            console.log(`  ✅ Updated successfully`);
            stats.fixed++;
          }
        } else {
          // URL was already correct or null
          stats.unchanged++;
        }
      } catch (profileError) {
        console.error(`Error processing profile ${profile.id}: ${profileError.message}`);
        stats.errors++;
      }
    }
    
    // Print summary
    console.log('\nSummary:');
    console.log(`Total profiles processed: ${stats.total}`);
    console.log(`URLs fixed: ${stats.fixed}`);
    console.log(`URLs unchanged: ${stats.unchanged}`);
    console.log(`Errors: ${stats.errors}`);
    console.log('\nAvatar URL fixing complete!');
    
  } catch (err) {
    console.error('Error in fixAvatarUrls:', err.message);
  }
}

// Run the fixer
fixAvatarUrls().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 