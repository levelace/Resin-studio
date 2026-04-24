import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        resin: {
          pink: "hsl(var(--resin-pink))",
          gold: "hsl(var(--resin-gold))",
          orange: "hsl(var(--resin-orange))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        "resin-gradient":
          "linear-gradient(120deg, hsl(var(--resin-pink)) 0%, hsl(var(--resin-orange)) 50%, hsl(var(--resin-gold)) 100%)",
        "resin-gradient-soft":
          "linear-gradient(120deg, hsl(var(--resin-pink) / 0.18) 0%, hsl(var(--resin-orange) / 0.12) 50%, hsl(var(--resin-gold) / 0.18) 100%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%":      { transform: "translate3d(18px, -14px, 0) scale(1.04)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%":      { transform: "translate3d(-24px, 22px, 0) scale(1.06)" },
        },
        pour: {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--resin-gold) / 0.45)" },
          "50%":      { boxShadow: "0 0 0 10px hsl(var(--resin-gold) / 0)" },
        },
      },
      animation: {
        "fade-in":    "fade-in 0.6s ease-out both",
        "fade-in-up": "fade-in-up 0.7s cubic-bezier(.2,.7,.3,1) both",
        float:        "float 12s ease-in-out infinite",
        "float-slow": "float-slow 18s ease-in-out infinite",
        pour:         "pour 14s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
