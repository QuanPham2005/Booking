/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        udck: {
          primary: "#003366",
          dark: "#002244",
          light: "#004080",
          accent: "#f0b429",
          "accent-light": "#ffc845",
          muted: "#e8eef4",
          "nav-footer": "#003366",
        },
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [],
};
