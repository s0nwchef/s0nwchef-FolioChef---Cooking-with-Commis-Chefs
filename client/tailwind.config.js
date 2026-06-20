/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#e6c487',
        'on-primary': '#412d00',
        surface: '#12131e',
        'surface-dim': '#12131e',
        'surface-container': '#1e1f2a',
        'surface-container-low': '#1a1b26',
        'surface-container-lowest': '#0c0d18',
        'surface-container-high': '#282935',
        'surface-container-highest': '#333440',
        'on-surface': '#e2e1f1',
        'on-surface-variant': '#d0c5b5',
        'primary-container': '#c9a96e',
        'on-primary-container': '#543d0c',
        'outline-variant': '#4d463a',
        outline: '#998f81',
        tertiary: '#ddc69f',
        secondary: '#cfc6b3',
        error: '#ffb4ab',
        'on-background': '#e2e1f1',
        background: '#12131e',
      },
      fontFamily: {
        sans: ['Cambria', 'Georgia', 'serif'],
        mono: ['Courier Prime', 'Courier New', 'monospace'],
      },
      fontSize: {
        'sidebar': ['13px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'toolbar': ['11px', { lineHeight: '1', letterSpacing: '0.06em' }],
      },
    },
  },
  plugins: [],
};
