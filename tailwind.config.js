/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/src/**/*.{html,ts}', // old (if anything still here)
    './apps/dashboard/src/**/*.{html,ts}', // ✅ NEW dashboard app
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
