import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "370px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1440px",
    },
    container: {
      screens: {
        xs: "390px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        xxl: "1440px",
      },
    },
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to top left, #881337 -30%, #0A011D 45%, #881337 190%)",
        "booking-card-gradient":
          "linear-gradient(143deg, #192145 30.17%, #200E16 100%)",
      },
      borderColor: {
        "semi-transparent-white": "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        onest: ["Onest", "sans-serif"],
      },
      maxWidth: {
        sm: `${540 / 16}rem`,
        md: `${720 / 16}rem`,
        lg: `${960 / 16}rem`,
        xl: `${1280 / 16}rem`,
        xxl: `${1280 / 16}rem`,
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        grey: {
          "100": "#F5F5F5",
          "150": "#fafafa",
          "200": "#F5F5F5",
          "250": "#f0f0f0",
          "300": "#D9D9D9",
          "350": "#bfbfbf",
          "400": "#8c8c8c",
          "450": "#595959",
          "500": "#434343",
          "550": "#262626",
          "600": "#1f1f1f",
          "650": "#141414",
        },
        primary: {
          "600": "#e50914",
          "700": "#BF0010",
          "900": "#730011",
          "1000": "#4D000E",
        },
        neutral: {
          "100": "#ffffff",
          "700": "#8C8C8C",
        },
      },
      fontSize: {
        "12": "12px",
        "14": "14px",
        "16": "16px",
        "18": "18px",
        "20": "20px",
        "28": "28px",
        "36": "36px",
        "56": "56px",
      },
      lineHeight: {
        "1-21": "1.21",
        "1-43": "1.43",
        "1-5": "1.5",
        "1-63": "1.63",
        "1-86": "1.86",
      },
      transitionProperty: {
        "height-min-height": "height, min-height",
      },
      keyframes: {
        fadeInOut: {
          "0%, 100%": { opacity: "1" },
          "15%": { opacity: "1" },
          "25%": { opacity: "0" },
          "65%": { opacity: "0" },
          "75%": { opacity: "1" },
        },
        fadeOutIn: {
          "0%, 100%": { opacity: "0" },
          "15%": { opacity: "0" },
          "25%": { opacity: "1" },
          "65%": { opacity: "1" },
          "75%": { opacity: "0" },
        },
      },
      animation: {
        fadeInOut: "fadeInOut 9s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        fadeOutIn: "fadeOutIn 9s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
