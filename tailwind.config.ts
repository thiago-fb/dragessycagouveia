import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#F5EFE6',
          bronze: '#8B5E3C',
          gold: '#C9A96E',
          white: '#FDFAF6',
          dark: '#3D2B1F',
          muted: '#A67C5B',
        },
      },
      fontFamily: {
        playfair: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        jost: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #F5EFE6 0%, #EDE3D7 100%)',
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: '50% 50%, 50% 50%' },
          to: { backgroundPosition: '350% 50%, 350% 50%' },
        },
      },
      animation: {
        aurora: 'aurora 60s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config