/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        // Increased typography scale (18px base instead of 16px)
        // Proportional increase: ~12.5% larger
        xs: ['0.75rem', { lineHeight: '1rem' }],      // 13.5px (was 12px)
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 15.75px (was 14px)
        base: ['1rem', { lineHeight: '1.5rem' }],    // 18px (was 16px)
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 20.25px (was 18px)
        xl: ['1.25rem', { lineHeight: '1.75rem' }],  // 22.5px (was 20px)
        '2xl': ['1.5rem', { lineHeight: '2rem' }],   // 27px (was 24px)
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 33.75px (was 30px)
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 40.5px (was 36px)
        '5xl': ['3rem', { lineHeight: '1' }],        // 54px (was 48px)
      },
    },
  },
  plugins: [],
}
