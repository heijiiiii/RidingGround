/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', 'AppleSDGothicNeo', 'Noto Sans KR', 'sans-serif'],
        scdream: ['AppleSDGothicNeo', 'Noto Sans KR', 'S-Core Dream', 'sans-serif'],
      },
      animation: {
        'emotion-wave': 'wave 4s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      colors: {
        mint: '#B4D8D6',
        purple: {
          light: '#BAB0F9',
          DEFAULT: '#8572FF',
        },
        pink: {
          DEFAULT: '#EA7C97',
        },
        bg: '#E5E5E5',
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
        },
        gray: {
          dark: '#4A4A4A',
          light: '#F6F6F6',
          lighter: '#94A3B8',
        },
        text: '#1E293B',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #8572FF10 1px, transparent 1px), linear-gradient(to bottom, #8572FF10 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-pattern': '20px 20px',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        md: '3rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
  },
  plugins: [],
} 