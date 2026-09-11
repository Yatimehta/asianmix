import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
          light: "var(--color-secondary-light)",
        },
        accent: {
          green: {
            DEFAULT: "var(--color-accent-green)",
            light: "var(--color-accent-green-light)",
            border: "var(--color-accent-green-border)",
          },
          orange: {
            DEFAULT: "var(--color-accent-orange)",
            light: "var(--color-accent-orange-light)",
            border: "var(--color-accent-orange-border)",
          },
          teal: {
            DEFAULT: "var(--color-accent-teal)",
            light: "var(--color-accent-teal-light)",
            border: "var(--color-accent-teal-border)",
          },
          red: {
            DEFAULT: "var(--color-accent-red)",
            light: "var(--color-accent-red-light)",
            border: "var(--color-accent-red-border)",
          },
        },
        asian: {
          terracotta: {
            50: "#FDF6F3",
            100: "#FBECE6",
            200: "#F7D8CC",
            500: "#C85A32",
            600: "#B84A2A",
            700: "#96371D",
            800: "#752A15",
            900: "#531D0E",
          },
          jade: {
            50: "#F0F7F4",
            100: "#DBEDE4",
            500: "#2D6A4F",
            600: "#1B4332",
            700: "#143326",
            800: "#0D2219",
            900: "#08130E",
          },
          mustard: {
            50: "#FDFBF4",
            100: "#FAF6E2",
            300: "#E9C46A",
            400: "#E09F3E",
            500: "#CA8A04",
            600: "#A16207",
          },
          cream: {
            50: "#FFFEFC",
            100: "#FDFBF7",
            200: "#F8F5EE",
            300: "#EFEBE0",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
