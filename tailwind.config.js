/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#efeee9",
      },
      fontFamily: {
        sans: ['Manrope', 'Arial', 'sans-serif'],
        display: ['"Space Grotesk"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
