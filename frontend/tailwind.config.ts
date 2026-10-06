import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "#0E1419", acero: "#1B2A38", galva: "#E6E9EB", naranja: "#FF5C00" },
    fontFamily: {
      display: ["var(--f-display)", "Impact", "sans-serif"],
      body: ["var(--f-body)", "system-ui", "sans-serif"],
      mono: ["var(--f-mono)", "monospace"],
    },
    keyframes: { marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } } },
    animation: { marquee: "marquee 30s linear infinite" },
    borderRadius: { DEFAULT: "2px" },
  } },
  plugins: [],
} satisfies Config;