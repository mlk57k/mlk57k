import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50:  "#F6E8DF",
          100: "#EAD4C6",
          200: "#EAD4C6",
          300: "#D4947A",
          400: "#BD6E4C",
          500: "#A55C3D",
          600: "#8B4D33",
          700: "#743F2B",
          800: "#5D3222",
          900: "#48271A",
        },
        cream: {
          50:  "#FBF7EE",
          100: "#F3ECDD",
          200: "#E7DDCB",
          300: "#D6C9B4",
          400: "#C0AD94",
          500: "#9A8A72",
        },
        champagne: {
          50:  "#F6E8DF",
          100: "#EAD4C6",
          200: "#E0CFC0",
          300: "#CDA45C",
          400: "#CDA45C",
          500: "#B08A42",
        },
        sage: {
          DEFAULT: "#8FA086",
          light: "#B4C4B0",
          dark: "#6B8061",
        },
        gold: {
          DEFAULT: "#CDA45C",
          light: "#E8CFA0",
        },
        blush: {
          DEFAULT: "#D3917C",
          light: "#EDCABD",
        },
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        "soft": "0 2px 8px -2px rgba(60,40,30,0.08), 0 4px 16px -4px rgba(60,40,30,0.06)",
        "lift": "0 8px 30px -8px rgba(60,40,30,0.14), 0 2px 8px -2px rgba(60,40,30,0.08)",
        "glow-coral": "0 10px 40px -10px rgba(196,82,58,0.40)",
        "premium": "0 20px 60px -20px rgba(60,40,30,0.22), 0 8px 24px -12px rgba(60,40,30,0.12)",
      },
      backgroundImage: {
        "gradient-glowy": "linear-gradient(160deg, #FFFFFF 0%, #FBF1EC 60%, #FAF8F4 100%)",
        "gradient-coral": "linear-gradient(135deg, #A3402D 0%, #C4523A 100%)",
        "gradient-champagne": "linear-gradient(135deg, #9A864F 0%, #CBB988 100%)",
        "shimmer": "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fadeIn 0.7s ease-out both",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 1.5s infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "glow-pulse": "glowPulse 3.5s ease-in-out infinite",
        "marquee": "marquee 32s linear infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
