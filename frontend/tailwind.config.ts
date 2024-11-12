import type { Config } from "tailwindcss";

const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        colorHintedGrey1: "#0e0e10",
        colorHintedGrey2: "#18181b",
        colorHintedGrey3: "#1f1f23",
        colorHintedGrey4: "#26262c",
        colorHintedGrey5: "#323239",
        colorHintedGrey6: "#3b3b44",
        colorHintedGrey7: "#53535f",
        colorHintedGrey8: "#848494",
        colorHintedGrey9: "#adadb8",
        colorHintedGrey10: "#c8c8d0",
        colorHintedGrey11: "#d3d3d9",
        colorHintedGrey12: "#dedee3",
        colorHintedGrey13: "#e6e6ea",
        colorHintedGrey14: "#efeff1",
        colorHintedGrey15: "#f7f7f8",
        colorBgButtonPrimary: "#5c16c5",
        colorBgButtonPrimaryHover: "#772ce8",
        colorBgButtonSecondary: "grba(83, 83, 95, 0.38)",
        colorBgButtonSecondaryHover: "grba(83, 83, 95, 0.48)",
        colorBorderPrimary: "grba(83, 83, 95, 0.48)",
        colorTextLink: "bf94ff",
        colorTextLinkHover: "a970ff",
      },
    },
  },
  plugins: [],
});

export default config;
