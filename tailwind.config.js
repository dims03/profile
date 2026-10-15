/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "16px",
    },
    extend: {
      colors: {
        cream: "#efeee9",
        primary: "#14b8a6",
        dark: "#0f172a",
        secondary: "#64748b",
      },
      fontFamily: {
        hn: ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      screens: {
        "2xl": "1320px",
      },
    },
  },
  plugins: [],
};
