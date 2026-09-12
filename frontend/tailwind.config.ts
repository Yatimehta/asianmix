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
        /* Primary Hero Color: Pinwheel Yellow / Amber */
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
          border: "var(--color-primary-border)",
          text: "var(--color-primary-text)",
        },
        /* Structural Base: Neutral Dark Charcoal */
        charcoal: {
          dark: "var(--color-charcoal-dark)",
          DEFAULT: "var(--color-charcoal-base)",
          hover: "var(--color-charcoal-hover)",
          light: "var(--color-charcoal-light)",
          border: "var(--color-charcoal-border)",
        },
        /* Functional Secondary Badges */
        brand: {
          yellow: {
            DEFAULT: "var(--color-primary)",
            dark: "var(--color-primary-dark)",
            light: "var(--color-primary-light)",
            border: "var(--color-primary-border)",
          },
          red: {
            dark: "var(--color-red-dark)",
            DEFAULT: "var(--color-red-base)",
            light: "var(--color-red-light)",
            border: "var(--color-red-border)",
          },
          green: {
            dark: "var(--color-green-dark)",
            DEFAULT: "var(--color-green-base)",
            light: "var(--color-green-light)",
            border: "var(--color-green-border)",
          },
          teal: {
            dark: "var(--color-teal-dark)",
            DEFAULT: "var(--color-teal-base)",
            light: "var(--color-teal-light)",
            border: "var(--color-teal-border)",
          },
        },
        accent: {
          teal: {
            DEFAULT: "var(--color-accent-teal)",
            light: "var(--color-accent-teal-light)",
            border: "var(--color-accent-teal-border)",
          },
          green: {
            DEFAULT: "var(--color-accent-green)",
            light: "var(--color-accent-green-light)",
            border: "var(--color-accent-green-border)",
          },
          red: {
            DEFAULT: "var(--color-accent-red)",
            light: "var(--color-accent-red-light)",
            border: "var(--color-accent-red-border)",
          },
          orange: {
            DEFAULT: "var(--color-accent-orange)",
            light: "var(--color-accent-orange-light)",
            border: "var(--color-accent-orange-border)",
          },
        },
      },
      boxShadow: {
        'card': '0 4px 16px -2px rgba(44, 44, 42, 0.06), 0 2px 6px -1px rgba(44, 44, 42, 0.03)',
        'card-hover': '0 12px 28px -4px rgba(44, 44, 42, 0.12), 0 4px 10px -2px rgba(44, 44, 42, 0.04)',
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
