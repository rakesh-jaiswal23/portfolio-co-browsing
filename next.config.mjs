/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ✅ CSS processing ke liye
  transpilePackages: [],
  experimental: {
    optimizeCss: false, // Agar true hai toh false karo
  },
};

export default nextConfig;