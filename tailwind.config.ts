import type { Config } from "tailwindcss";

/**
 * Nimba Money design tokens.
 * Brand: deep forest green + light neutral workspace.
 * Guinea flag colors are available only as tiny accent utilities.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // h-4.5/w-4.5 (18px) icons are used across the app; not in Tailwind's
      // default spacing scale, so without this they fall back to 24px
      spacing: {
        "4.5": "1.125rem",
      },
      colors: {
        brand: {
          950: "#04211C", // darkest — sidebar bottom
          900: "#063F35", // deep brand green (sidebar)
          800: "#0A5245",
          700: "#0E6653",
          600: "#0B7A55",
          500: "#008A58", // nimba green (primary actions)
          400: "#17A46E",
          300: "#4CC594",
          200: "#A7E3C8",
          100: "#D9F3E7",
          50: "#EFFAF4",
        },
        surface: {
          DEFAULT: "#F6F8F7",
          card: "#FFFFFF",
          sunken: "#EEF2F0",
        },
        ink: {
          DEFAULT: "#101B17",
          secondary: "#3D4C46",
          muted: "#68776F",
          faint: "#93A19A",
        },
        line: {
          DEFAULT: "#E2E8E5",
          strong: "#CBD5D0",
        },
        // dark-mode surfaces (deep green/slate, never pure black)
        night: {
          bg: "#0B1512",
          card: "#101E19",
          raised: "#15271F",
          line: "#1F3A30",
          lineStrong: "#2A4A3D",
        },
        // Marketplace (blue product) — deep navy sidebar + royal blue actions
        navy: {
          950: "#050D1C",
          900: "#0A1B33",
          800: "#122947",
          700: "#1B3A63",
        },
        mkt: {
          700: "#1E40AF",
          600: "#1D4ED8",
          500: "#2563EB",
          400: "#3B82F6",
          300: "#93C5FD",
          200: "#BFDBFE",
          100: "#DBEAFE",
          50: "#EFF4FF",
        },
        // Guinea flag — tiny accents only
        gn: {
          red: "#CE1126",
          yellow: "#FCD116",
          green: "#009460",
        },
        info: "#2563EB",
        warn: "#B45309",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        card: "12px",
        control: "9px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(6 63 53 / 0.04)",
        raised:
          "0 1px 2px rgb(6 63 53 / 0.05), 0 4px 16px -4px rgb(6 63 53 / 0.10)",
        overlay:
          "0 4px 12px rgb(4 33 28 / 0.10), 0 16px 48px -8px rgb(4 33 28 / 0.22)",
      },
      maxWidth: {
        shell: "1600px",
      },
    },
  },
  plugins: [],
};
export default config;
