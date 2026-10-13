import { nextui } from "@nextui-org/react";
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      map: { min: "360px", max: "1279px" },

      phone: { min: "360px", max: "767px" },

      tablet: { min: "768px", max: "1023px" },

      laptop: { min: "1024px", max: "1279px" },

      desktop: { min: "1280px" },
    },
  },
  darkMode: "class",
  plugins: [nextui(), daisyui],
};
