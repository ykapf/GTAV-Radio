import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f5f0e6",
        expired: "#ff4d4d",
      },
      fontFamily: {
        headline: ["HEADLINE", "sans-serif"],
        kaftan: ["Kaftan", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
