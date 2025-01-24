/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f1f1f", // Black/Dark grey
        secondary: "#3f3f3f", // Silver/Grey
        accent: "#e5e5e5", // Light grey/White
        textLight: "#ffffff", // White for text
        textDark: "#000000", // Black for text
      },
    },
  },
  plugins: [],
};
