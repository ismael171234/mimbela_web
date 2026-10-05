import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "#121A22", acero: "#22313F", galva: "#DDE1E4", naranja: "#FF6A13" },
    fontFamily: { display: ["var(--f-display)"], body: ["var(--f-body)"] },
    borderRadius: { DEFAULT: "2px" },
  } },
  plugins: [],
} satisfies Config;
