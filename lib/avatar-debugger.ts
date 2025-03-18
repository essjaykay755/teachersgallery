/**
 * Avatar Debugger Utility
 * 
 * This file provides utilities to help debug avatar loading issues.
 */

/**
 * Tests if an image URL is accessible
 * @param url The URL to test
 * @returns A promise that resolves to a status object
 */
export async function testImageUrl(url: string): Promise<{
  url: string;
  status: 'success' | 'error';
  message?: string;
  timeTaken?: number;
}> {
  if (!url) {
    return {
      url,
      status: 'error',
      message: 'URL is empty'
    };
  }

  const startTime = Date.now();
  
  try {
    // Create a new image element
    return new Promise((resolve) => {
      const img = new Image();
      
      // Set up event handlers
      img.onload = () => {
        const timeTaken = Date.now() - startTime;
        resolve({
          url,
          status: 'success',
          message: `Image loaded successfully in ${timeTaken}ms`,
          timeTaken
        });
      };
      
      img.onerror = () => {
        const timeTaken = Date.now() - startTime;
        resolve({
          url,
          status: 'error',
          message: `Failed to load image in ${timeTaken}ms`,
          timeTaken
        });
      };
      
      // Set source to trigger loading
      img.src = url;
      
      // Set a timeout in case the image hangs
      setTimeout(() => {
        if (!img.complete) {
          resolve({
            url,
            status: 'error',
            message: 'Image loading timed out (5s)',
            timeTaken: 5000
          });
        }
      }, 5000);
    });
  } catch (error) {
    return {
      url,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Transforms an avatar URL to ensure it's properly formatted and accessible
 * This addresses common issues with Supabase Storage URLs
 */
export function fixAvatarUrl(url: string | null | undefined): string {
  // Handle null/undefined
  if (!url) {
    return '/default-avatar.png';
  }
  
  // Trim whitespace
  const trimmedUrl = url.trim();
  
  // If empty after trimming, use default
  if (!trimmedUrl) {
    return '/default-avatar.png';
  }
  
  // If it's a default avatar reference, use the known good path
  if (
    trimmedUrl === '@default-avatar.png' || 
    trimmedUrl === '/default-avatar.png' ||
    trimmedUrl.includes('default-avatar')
  ) {
    return '/default-avatar.png';
  }
  
  // Handle data URLs (they are already embedded and don't need processing)
  if (trimmedUrl.startsWith('data:image/')) {
    return trimmedUrl;
  }
  
  // Fix common Supabase storage URL issues
  if (trimmedUrl.includes('supabase.co')) {
    try {
      // Parse the URL to ensure it's properly formatted
      const parsedUrl = new URL(trimmedUrl);
      
      // Ensure the protocol is https
      if (parsedUrl.protocol !== 'https:') {
        parsedUrl.protocol = 'https:';
      }
      
      // Fix common path issues in Supabase storage URLs
      let path = parsedUrl.pathname;
      
      // Normalize multiple slashes to single slashes (except for protocol://)
      path = path.replace(/([^:])\/+/g, '$1/');
      
      // Ensure path starts with /storage/v1/object/public
      if (!path.includes('/storage/v1/object/public')) {
        // If path contains 'avatars' but not the full storage path, reconstruct it
        if (path.includes('/avatars/')) {
          const avatarFileName = path.split('/avatars/').pop();
          if (avatarFileName) {
            path = `/storage/v1/object/public/avatars/${avatarFileName}`;
          }
        }
      }
      
      parsedUrl.pathname = path;
      
      // Return the fixed URL
      return parsedUrl.toString();
    } catch (error) {
      // If URL parsing fails, proceed with basic fixes
      console.warn('Failed to parse Supabase URL:', trimmedUrl, error);
      
      // Fix double slashes
      let fixedUrl = trimmedUrl.replace(/([^:])\/+/g, '$1/');
      
      return fixedUrl;
    }
  }
  
  // For public URLs, ensure they start with / if they are local paths
  if (!trimmedUrl.startsWith('http') && !trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('data:')) {
    return `/${trimmedUrl}`;
  }
  
  // For all other cases, return the original URL
  return trimmedUrl;
}

/**
 * Logs information about an avatar URL for debugging
 */
export function logAvatarUrl(url: string | null | undefined, context: string): void {
  console.log(`[Avatar Debug] ${context}:`, {
    originalUrl: url,
    fixedUrl: url ? fixAvatarUrl(url) : null,
    isEmpty: !url || url.trim() === '',
    isDefault: url?.includes('default-avatar'),
    isSupabase: url?.includes('supabase.co'),
    timestamp: new Date().toISOString()
  });
} 