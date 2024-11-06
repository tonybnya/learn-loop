/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js}"
  ],
  theme: {
    fontFamily: {
      inter: ['Inter', 'system-ui', 'sans-serif'],
      opensans: ['Open Sans', 'system-ui', 'sans-serif'],
      roboto: ['Roboto', 'system-ui', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
}

