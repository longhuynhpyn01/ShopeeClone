/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    // disable class container trong tailwind
    container: false
  },
  theme: {
    extend: {
      // add colors
      colors: {
        orange: "#ee4d2d"
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      // add class container custom
      addComponents({
        ".container": {
          maxWidth: theme("columns.7xl"),
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: theme("spacing.4"),
          paddingRight: theme("spacing.4")
        }
      });
    })
    // require("@tailwindcss/line-clamp")
  ]
};
