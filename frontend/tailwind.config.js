/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}" // ✅ ต้องมี path นี้
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-prompt)', 'sans-serif'],
      },
    }
  },
  plugins: []
};
