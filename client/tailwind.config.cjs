/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          650: "#da1b6a"
        },
        neutral: {
          1000: "#0d0d0d"
        }
      }
    },
  },
  plugins: [],
}
