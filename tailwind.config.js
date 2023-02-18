/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["var(--font-poppins)", ...fontFamily.sans],
      body: ["var(--font-karla)", ...fontFamily.sans],
    },
    extend: {
      colors: {
        primary: {
          50: "#f1f4ff",
          100: "#e6ebff",
          200: "#d0daff",
          300: "#a9b8ff",
          400: "#798bff",
          500: "#4352ff",
          600: "#1d23ff",
          700: "#0c11f5",
          800: "#090dce",
          900: "#090c9b",
        },
        success: {
          100: "#F4FCCD",
          200: "#E8FA9D",
          300: "#D3F16A",
          400: "#BBE444",
          500: "#9BD30E",
          600: "#7FB50A",
          700: "#669707",
          800: "#4E7A04",
          900: "#3D6502",
        },
        info: {
          100: "#CCFDFF",
          200: "#99F4FF",
          300: "#67E5FF",
          400: "#41D2FF",
          500: "#02B3FF",
          600: "#018BDB",
          700: "#0168B7",
          800: "#004A93",
          900: "#00357A",
        },
        warning: {
          100: "#FFF7CC",
          200: "#FFEE99",
          300: "#FFE266",
          400: "#FFD63F",
          500: "#FFC300",
          600: "#DBA200",
          700: "#B78300",
          800: "#936600",
          900: "#7A5100",
        },
        danger: {
          100: "#FFE8D6",
          200: "#FFCCAE",
          300: "#FFA985",
          400: "#FF8767",
          500: "#FF5035",
          600: "#DB3026",
          700: "#B71A1E",
          800: "#93101E",
          900: "#7A0A1E",
        },
        "ship-gray": {
          50: "#f7f7f8",
          100: "#efedf1",
          200: "#dad7e0",
          300: "#bab4c5",
          400: "#938ba5",
          500: "#776d8a",
          600: "#605871",
          700: "#4f485c",
          800: "#443e4e",
          900: "#3c3744",
        },
      },
    },
  },
  plugins: [],
};
