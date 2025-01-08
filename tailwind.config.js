/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], // Agrega Roboto como fuente personalizada
      },
      keyframes: {
        fadeInLeft: {
          "0%": {opacity: "0", transform: "translateX(20px)"},
          "100%": {opacity: "1", transform: "translateX(0)"},
        },
        fadeInUp: {
          "0%": {opacity: "0", transform: "translateY(20px)"},
          "100%": {opacity: "1", transform: "translateY(0)"},
        },
      },
      animation: {
        fadeInLeft: "fadeInLeft 0.5s ease-out forwards",
        fadeInUp: "fadeInUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
