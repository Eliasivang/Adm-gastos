/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    fontFamily: {
      jost: ['Jost', "sans-serif"],
    },
    extend: {
      colors:{
        background1: "rgb(255, 97, 97);"
      }
    },
  },
  plugins: [],
}
