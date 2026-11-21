import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#021B3B",
          900: "#021B3B",
          800: "#062748",
          700: "#0A365E",
        },
        royal: "#0055D4",
        sky: "#0099FF",
        aqua: "#00C8FF",
        canvas: "#FAFCFF",
        hairline: "#E3ECF7",
        ink: {
          DEFAULT: "#021B3B",
          muted: "#4A6485",
          faint: "#7D93AE",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.16em" }],
      },
      borderRadius: {
        card: "20px",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(110deg, #0055D4 0%, #0099FF 55%, #00C8FF 100%)",
        "sky-gradient": "linear-gradient(135deg, #0099FF 0%, #00C8FF 100%)",
      },
      boxShadow: {
        pane: "0 1px 2px rgba(2,27,59,.04), 0 12px 32px -12px rgba(2,27,59,.14)",
        lift: "0 2px 4px rgba(2,27,59,.05), 0 28px 60px -24px rgba(0,85,212,.38)",
        glow: "0 0 0 1px rgba(0,153,255,.28), 0 0 44px -8px rgba(0,200,255,.55)",
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-14px,0)" },
        },
        sweep: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
      },
      animation: {
        drift: "drift 7s ease-in-out infinite",
        sweep: "sweep 3.2s cubic-bezier(.4,0,.2,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
