/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0a0a0a',
          text: '#e5e5e5',
          mute: '#a1a1aa',
        },
      },
      maxWidth: { prose: '72ch' },
    },
  },
  plugins: [],
};
