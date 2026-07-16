import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#07131f",
          900: "#0d1b2a",
          850: "#122236",
          800: "#18304a",
        },
        accent: {
          400: "#37d6d4",
          500: "#1fc5d9",
          600: "#149fb5",
        },
        danger: "#ff6b6b",
        success: "#45d483",
        warning: "#f7b955",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(55,214,212,0.18), 0 12px 48px rgba(16,42,67,0.36)",
      },
      backgroundImage: {
        "grid-radial":
          "radial-gradient(circle at top, rgba(31,197,217,0.12), rgba(7,19,31,0.2) 24%, rgba(7,19,31,0.96) 64%)",
      },
    },
  },
  plugins: [],
} satisfies Config;

