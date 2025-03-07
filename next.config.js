/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'i.pravatar.cc',
      // Handle Supabase URLs - both API and Storage URLs
      process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '') : '',
      // Add storage domain pattern for Supabase based on project reference
      process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0]}.supabase.co` 
        : '',
      // Fallback for direct Supabase Storage URLs (if your URL format is different)
      process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0]}.supabase.in` 
        : '',
      'supabase.co', // Generic supabase domain for storage
      'supabase.in', // Alternative supabase domain
    ].filter(Boolean)
  },
  // Disable source maps in development to prevent source map errors
  // This is a performance tradeoff but eliminates the "Invalid URL" errors
  productionBrowserSourceMaps: false
}

module.exports = nextConfig 