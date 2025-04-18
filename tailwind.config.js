/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['var(--font-playfair)', 'serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
        'amiri': ['var(--font-amiri)', 'serif'],
        'scheherazade': ['Scheherazade New', 'serif'],
        'noto-naskh': ['Noto Naskh Arabic', 'serif'],
        'noto-sans': ['Noto Sans', 'sans-serif'],
      },
      colors: {
        gold: {
          light: '#d4af37',
          DEFAULT: '#ad7f31',
          dark: '#8b6b2c',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            a: {
              color: 'var(--gold)',
              '&:hover': {
                color: 'var(--gold-light)',
              },
            },
            h1: {
              color: 'var(--gold)',
            },
            h2: {
              color: 'var(--gold)',
            },
            h3: {
              color: 'var(--gold)',
            },
            h4: {
              color: 'var(--gold)',
            },
            strong: {
              color: 'var(--gold)',
            },
          },
        },
      },
      backgroundColor: {
        'dark-bg': 'var(--dark-bg)',
        'dark-card': 'var(--dark-card)',
      },
      textColor: {
        'primary': 'var(--text-primary)',
        'secondary': 'var(--text-secondary)',
        'gold': 'var(--gold)',
      },
      borderColor: {
        'gold': 'var(--gold)',
        'dark-border': 'var(--dark-border)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 