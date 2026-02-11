import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chessDark: "#0B0E14",
        chessGold: "#C9A24D",
      },
    },
  },
  plugins: [],
};

export default config;
