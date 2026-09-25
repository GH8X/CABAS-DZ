import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1360px" },
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // CABAS DZ brand — European blue + golden yellow
        brand: {
          50: "#F1F5FF",
          100: "#E3EAFE",
          200: "#C4D3FA",
          300: "#93AEF4",
          400: "#5C82E8",
          500: "#3560D6",
          600: "#2045B6",
          700: "#163490",
          800: "#0F2A6E",
          900: "#0A1E52",
          950: "#061338",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FFF4C6",
          200: "#FFE88A",
          300: "#FFD75C",
          400: "#F5C142",
          500: "#E0A61C",
          600: "#BC8212",
          700: "#966112",
          800: "#7A4D15",
          900: "#684016",
        },
        cream: {
          50: "#FDFCF8",
          100: "#FBF9F3",
          200: "#F5F1E6",
          300: "#EBE4D3",
        },
        ink: {
          DEFAULT: "#0B1220",
          soft: "#3B4763",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "ui-serif", "serif"],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(11, 30, 82, 0.08), 0 8px 24px -12px rgba(11, 30, 82, 0.14)",
        lift: "0 18px 44px -18px rgba(11, 30, 82, 0.32)",
        glow: "0 0 0 1px rgba(245, 193, 66, 0.35), 0 16px 40px -16px rgba(224, 166, 28, 0.5)",
      },
      backgroundImage: {
        "eu-radial":
          "radial-gradient(1000px 520px at 12% -10%, rgba(53,96,214,0.35), transparent 60%), radial-gradient(760px 460px at 88% 0%, rgba(245,193,66,0.28), transparent 62%)",
        "gold-shine":
          "linear-gradient(120deg, #FFE88A 0%, #F5C142 34%, #E0A61C 66%, #FFD75C 100%)",
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
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(8deg)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.25", transform: "scale(0.85)" },
          "50%": { opacity: "0.9", transform: "scale(1.1)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 7s ease-in-out infinite",
        twinkle: "twinkle 3.4s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
