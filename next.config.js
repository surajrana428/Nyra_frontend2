/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export', // Critical for Vercel
  images: {
    unoptimized: true // Disable problematic image optimization
  },
  eslint: {
    ignoreDuringBuilds: true // Skip build-time linting
  }
}