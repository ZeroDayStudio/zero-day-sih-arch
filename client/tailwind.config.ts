import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: "#0F2027",
        leaf: "#5f866f",
        moss: "#b9cfbf",
        saffron: "#d6a35d",
        paper: "#ffffff",
        line: "#d9e2e8",
        coral: "#c96e5c",
      },
    },
  },
  plugins: [],
};
export default config;
