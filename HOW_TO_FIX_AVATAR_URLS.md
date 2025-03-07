# How to Fix Avatar URLs Not Displaying

If you're experiencing an issue where only default avatars are showing even after uploading custom avatars, there could be several causes. This guide will help you resolve the most common issues.

## 1. Check Your Storage Policies First

Make sure your Supabase storage policies are correctly set up by following the instructions in the `HOW_TO_FIX_STORAGE_RLS_ERROR.md` file.

## 2. Run SQL to Fix Avatar URLs in the Database

Sometimes the avatar URLs in the database may have formatting issues or incorrect references. Run this SQL in your Supabase SQL Editor:

```sql
-- Find all profiles with avatar URLs to check formatting
SELECT id, avatar_url FROM profiles WHERE avatar_url IS NOT NULL AND avatar_url != '';

-- Update any avatar URLs that might have common issues
UPDATE profiles
SET avatar_url = TRIM(avatar_url)
WHERE avatar_url LIKE '% %' OR avatar_url LIKE ' %' OR avatar_url LIKE '% ';

-- Optional: If you have identified specific URL problems, fix them:
-- For example, if URLs have double slashes where they shouldn't:
UPDATE profiles
SET avatar_url = REGEXP_REPLACE(avatar_url, '([^:])//+', '\1/', 'g')
WHERE avatar_url LIKE '%//%';

-- If you want to reset all avatar URLs and start fresh:
-- UPDATE profiles SET avatar_url = NULL;
```

## 3. Check Your Network Console for Errors

Open your browser's developer tools (F12), go to the Network tab, and look for any failed requests to image URLs. Common issues include:

1. **CORS errors**: Look for 403 or 401 errors with CORS messages
2. **404 errors**: The avatar file might be missing from your storage bucket
3. **URL errors**: The URL format might be incorrect

## 4. Test Direct Image Access

Try accessing your avatar URL directly in the browser. Copy the failing image URL from the network tab and paste it into a new browser tab. If it doesn't load:

1. Check that the bucket is publicly accessible
2. Verify that the file exists in the Supabase storage dashboard

## 5. Verify Next.js Image Configuration

If you're using Next.js Image component, ensure your `next.config.js` has the correct domain configuration:

```js
const nextConfig = {
  images: {
    domains: [
      'your-project-ref.supabase.co',
      // Add any other necessary domains
    ]
  }
}
```

## 6. Restart Your Application

After making changes:

1. Restart your Next.js development server
2. Clear your browser cache (CTRL+F5 or ⌘+Shift+R)
3. Log out and log back in

## 7. Check the Avatar Component Logic

Review the Avatar component in your code to ensure it's not aggressively defaulting to the default avatar. Make sure it:

1. Only falls back to the default avatar when necessary
2. Properly passes the URL to the `<img>` element 
3. Logs errors on failed image loads

## 8. Test With a New Upload

After applying these fixes, try uploading a new avatar to see if it displays correctly.

## Need More Help?

If the issue persists, check:

1. Browser console logs for specific error messages
2. Server logs for backend errors
3. Supabase console for storage related issues

Advanced troubleshooting may require examining network requests in detail to see what's happening with the image loading process. 