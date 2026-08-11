import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand palette: Trustworthy Blue + Warm Amber ──────────────────
        // Primary = blue-600 family (trust, professionalism)
        "primary":                   "#2563EB",
        "primary-fixed":             "#DBEAFE",
        "primary-fixed-dim":         "#93C5FD",
        "primary-container":         "#1D4ED8",
        "on-primary":                "#ffffff",
        "on-primary-container":      "#DBEAFE",
        "on-primary-fixed":          "#1E3A8A",
        "on-primary-fixed-variant":  "#1D4ED8",
        "inverse-primary":           "#60A5FA",
        "surface-tint":              "#2563EB",

        // Secondary = amber-500 family (action / CTA)
        "secondary":                 "#D97706",
        "secondary-fixed":           "#FEF3C7",
        "secondary-fixed-dim":       "#FCD34D",
        "secondary-container":       "#F59E0B",
        "on-secondary":              "#ffffff",
        "on-secondary-container":    "#78350F",
        "on-secondary-fixed":        "#78350F",
        "on-secondary-fixed-variant":"#92400E",

        // Tertiary = green-600 family (success)
        "tertiary":                  "#16A34A",
        "tertiary-fixed":            "#DCFCE7",
        "tertiary-fixed-dim":        "#86EFAC",
        "tertiary-container":        "#15803D",
        "on-tertiary":               "#ffffff",
        "on-tertiary-container":     "#DCFCE7",
        "on-tertiary-fixed":         "#14532D",
        "on-tertiary-fixed-variant": "#15803D",

        // Error = red-600 family (danger)
        "error":                     "#DC2626",
        "error-container":           "#FEE2E2",
        "on-error":                  "#ffffff",
        "on-error-container":        "#7F1D1D",

        // Surface / neutral — warm off-white (#F8FAFC per spec)
        "surface":                   "#F8FAFC",
        "surface-bright":            "#ffffff",
        "surface-dim":               "#E2E8F0",
        "surface-variant":           "#EFF6FF",
        "surface-container-lowest":  "#ffffff",
        "surface-container-low":     "#F8FAFC",
        "surface-container":         "#F1F5F9",
        "surface-container-high":    "#E2E8F0",
        "surface-container-highest": "#CBD5E1",
        "background":                "#F8FAFC",
        "inverse-surface":           "#1E293B",
        "inverse-on-surface":        "#F8FAFC",

        // On-surface text colours
        "on-surface":                "#0F172A",
        "on-surface-variant":        "#475569",
        "on-background":             "#0F172A",
        "outline":                   "#94A3B8",
        "outline-variant":           "#CBD5E1",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "stack-md": "16px",
        "unit": "8px",
        "gutter": "24px",
        "margin-desktop": "40px",
        "stack-lg": "32px",
        "container-max": "1200px",
        "stack-sm": "8px",
        "margin-mobile": "16px"
      }
    },
  },
  plugins: [],
};
export default config;
