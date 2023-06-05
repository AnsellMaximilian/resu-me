/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        "appheader-h": "3.5rem",
        "sidebar-w-open": "16rem",
      },

      colors: {
        primary: {
          main: "#f9fafb",
          dark: "#ebebeb",
        },
        secondary: {
          main: "#2185D5",
          dark: "#226eab",
          light: "#3a9ff0",
          lighter: "#96d1ff",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
