import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4682b4",
        secondary: "#E6B55C",
        dark: "#333333",
        light: "#F9F9F9",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        serif: ["var(--font-playfair-display)", "serif"],
      },
      backgroundImage: {
        "hero-pattern": "url('/images/hero-background.jpg')",
      },
    },
  },
  plugins: [],
};
export default config; 