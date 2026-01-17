import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        chalk: ['"Oswald"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Premium metallic colors
        platinum: {
          DEFAULT: "hsl(40, 5%, 75%)",
          light: "hsl(40, 10%, 85%)",
          dark: "hsl(40, 5%, 65%)",
        },
        bronze: {
          DEFAULT: "hsl(33, 60%, 50%)",
          light: "hsl(33, 60%, 60%)",
          dark: "hsl(33, 60%, 40%)",
        },
        gold: {
          DEFAULT: "hsl(42, 87%, 55%)",
          light: "hsl(45, 90%, 65%)",
          dark: "hsl(38, 90%, 45%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.9)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsla(42, 87%, 55%, 0.2)" },
          "50%": { boxShadow: "0 0 40px hsla(42, 87%, 55%, 0.4)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-in-up": "slide-in-up 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-gold": "linear-gradient(135deg, hsl(42, 87%, 55%) 0%, hsl(38, 90%, 45%) 100%)",
        "gradient-platinum": "linear-gradient(135deg, hsl(40, 5%, 75%) 0%, hsl(40, 10%, 85%) 100%)",
        "gradient-bronze": "linear-gradient(135deg, hsl(33, 60%, 50%) 0%, hsl(30, 50%, 40%) 100%)",
        shimmer: "linear-gradient(90deg, transparent 0%, hsla(42, 87%, 55%, 0.1) 50%, transparent 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 40px hsla(42, 87%, 55%, 0.2)",
        "gold-glow-lg": "0 0 60px hsla(42, 87%, 55%, 0.3)",
        "premium": "0 20px 60px -10px hsla(0, 0%, 0%, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
