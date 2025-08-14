// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  safelist: [
    'from-purple-500', 'to-pink-500',
    'hover:scale-105', 'bg-pink-500'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}