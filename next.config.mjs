/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mobile app configuration - uses server-side rendering with dynamic routes
  // Removed 'output: export' to support dynamic routes like /issues/[id]
  
  // Image optimization for better performance
  images: {
    unoptimized: false,
  },
};

export default nextConfig;