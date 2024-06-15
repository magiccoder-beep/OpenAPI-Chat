import type { Config } from "tailwindcss";
import Colors from "./src/constants/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textColor: {
        primary: Colors.primaryColor,
        secondary: Colors.secondaryColor,
        shadowPrimary: Colors.shadowPrimaryColor,
        accent: Colors.accentColor,
      },
      backgroundColor: {
        primary: Colors.primaryColor,
        secondary: Colors.secondaryColor,
        shadowPrimary: Colors.shadowPrimaryColor,
        accent: Colors.accentColor,
      },
      fontFamily: {
        fontRegular: "var(--font-regular)",
        fontBold: "var(--font-bold)",
        utmTimes: "var(--UTM-Times)",
        MathJaxRegular: "var(--MathJax_Regular)",
      },
      borderRadius: {
        custom: "12px",
      },
      borderColor: {
        primary: Colors.primaryColor,
        secondary: Colors.secondaryColor,
      },
      caretColor: {
        primary: Colors.primaryColor,
        secondary: Colors.secondaryColor,
      },
      screens: {
        sm: "550px",
        md: "576px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
export default config;
