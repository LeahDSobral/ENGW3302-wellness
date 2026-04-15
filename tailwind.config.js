/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Courier New"', 'Courier Prime', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        navy: {
          900: '#04080f',
          800: '#080e1a',
          700: '#0d1b2e',
          600: '#122236',
          500: '#1a3050',
        },
        cyan: {
          400: '#4fc3f7',
          300: '#81d4fa',
          200: '#b3e5fc',
        },
        slate: {
          300: '#ccd6f6',
          400: '#6a85b0',
        }
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'breathe-expand': { '0%': { transform: 'scale(0.6)', opacity: '0.5' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        'breathe-contract': { '0%': { transform: 'scale(1)', opacity: '1' }, '100%': { transform: 'scale(0.6)', opacity: '0.5' } },
        'float': { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        'glow-pulse': { '0%, 100%': { boxShadow: '0 0 15px #4fc3f730' }, '50%': { boxShadow: '0 0 35px #4fc3f760' } },
        'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    'scale-100', 'scale-60', 'opacity-50', 'opacity-100',
    'animate-float', 'animate-glow-pulse', 'animate-fade-in-up'
  ]
}
