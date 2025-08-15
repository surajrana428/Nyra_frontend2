// next.config.js
module.exports = {
  output: 'standalone', // Critical for Vercel
  images: {
    unoptimized: true, // Disable Vercel's image optimizer
  }
}
