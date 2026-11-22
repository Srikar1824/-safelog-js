/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0d1117",
          secondary: "#161b22",
          tertiary: "#21262d",
          card: "#1c2128",
        },
        accent: {
          green: "#4ade80",
          "green-dim": "#22c55e",
          "green-glow": "rgba(74,222,128,0.15)",
          blue: "#58a6ff",
          purple: "#a78bfa",
          orange: "#fb923c",
        },
        border: {
          subtle: "rgba(255,255,255,0.08)",
          accent: "rgba(74,222,128,0.3)",
        },
        text: {
          primary: "#e6edf3",
          secondary: "#8b949e",
          muted: "#484f58",
          accent: "#4ade80",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(74,222,128,0.12)",
        "glow-sm": "0 0 15px rgba(74,222,128,0.08)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        shimmer: "shimmer 2s infinite",
        pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow": "spin 8s linear infinite",
        typewriter: "typewriter 2s steps(40) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        typewriter: {
          "0%": { width: 0 },
          "100%": { width: "100%" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
