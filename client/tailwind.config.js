/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        podrygka: {
          pink: '#E91E8C',
          rose: '#F8B4D9',
          blush: '#FDE8F2',
          lilac: '#E8E0F5',
          mint: '#E6F5F0',
          cream: '#FFFBFC',
          deep: '#9B1B5A',
        },
      },
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        body: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 32px rgba(233, 30, 140, 0.12)',
        card: '0 4px 24px rgba(155, 27, 90, 0.08)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
