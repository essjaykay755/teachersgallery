# Common Issues & Fixes

This document provides solutions to common issues you might encounter in the TeachersGallery application.

## Profile Update Issues

### Issue: Stuck on "Saving..." when updating profile

**Symptoms:**
- When updating a profile, the UI shows "Saving..." indefinitely
- No error message is shown, but the update doesn't complete

**Solution:**
1. Run the `fix-database-issues.bat` (Windows) or `fix-database-issues.sh` (macOS/Linux) script
2. This will add missing columns to the database tables:
   - `updated_at` to the profiles table
   - `notification_preferences` to the profiles table
   - `gender` to the profiles and teacher_profiles tables

**Technical Details:**
The issue is caused by the application trying to update columns that don't exist in the database. The fix adds these missing columns and sets up a trigger to automatically update the `updated_at` field.

## Teacher Profile Loading Issues

### Issue: Teacher profile fails to load with timeout error

**Symptoms:**
- When clicking on a teacher card, the profile page sometimes fails to load
- Error in console about a loading timeout

**Solution:**
1. Run the `fix-database-issues.bat` (Windows) or `fix-database-issues.sh` (macOS/Linux) script
2. The application code has been updated to:
   - Better handle missing gender fields
   - Properly clean up timeouts when components unmount
   - Add more robust error handling

**Technical Details:**
The issue was caused by:
1. Missing gender columns in database tables
2. Not cleaning up timeouts when components unmount
3. Trying to update state after component unmounted

## Favorites Tab Not Loading

### Issue: Clicking on Favorites tab shows loading animation indefinitely

**Symptoms:**
- When clicking on the Favorites tab, it shows a loading animation forever
- No error message is shown, but the content doesn't load

**Solution:**
1. Run the `fix-database-issues.bat` (Windows) or `fix-database-issues.sh` (macOS/Linux) script
2. The application code has been updated to:
   - Better handle cases where the favorites table doesn't exist
   - Provide clear error messages
   - Prevent infinite loading states

**Technical Details:**
The issue was caused by:
1. Error handling not properly displaying messages to the user
2. No graceful fallback if the favorites table doesn't exist
3. Missing error state handling in the UI

## How to Run Database Fixes

### Using the Windows Fix Script

1. Open Command Prompt or PowerShell
2. Navigate to your project directory
3. Run the fix script:
   ```
   .\fix-database-issues.bat
   ```
4. Follow the prompts

### Using the macOS/Linux Fix Script

1. Open Terminal
2. Navigate to your project directory
3. Make the script executable:
   ```
   chmod +x fix-database-issues.sh
   ```
4. Run the fix script:
   ```
   ./fix-database-issues.sh
   ```
5. Follow the prompts

### Manual Database Update

If you prefer to run the SQL commands directly in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the SQL commands from the `supabase/migrations/20240605_add_missing_profile_columns.sql` file
5. Execute the query

## Prevention Tips

To prevent these issues in the future:

1. Always add database migrations when adding new fields to the application
2. Use proper TypeScript types that match the database schema
3. Implement robust error handling in API calls
4. Add timeouts to async operations to prevent infinite loading states
5. Clean up resources and timers when components unmount 