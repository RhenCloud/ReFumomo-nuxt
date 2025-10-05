/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue", 
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b5a8c',
          active: '#8b5a8c',
          hover: '#7a4f7b'
        },
        muted: '#6b7280'
      },
      fontFamily: {
        fumofumo: [
          'Comic Sans MS', 
          'Comic Sans', 
          'XiaokeNailao', 
          'Comic Neue', 
          'Chalkduster', 
          'Bradley Hand', 
          'Brush Script MT', 
          'Lucida Handwriting', 
          'Marker Felt', 
          'Snell Roundhand', 
          'Apple Chancery', 
          'Zapf Chancery', 
          'cursive', 
          'fantasy', 
          'sans-serif'
        ]
      },
      animation: {
        'bounce-in': 'bounceIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'sway': 'sway 2s ease-in-out infinite',
        'pulse': 'pulse 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'breathing': 'breathing 2s ease-in-out infinite'
      },
      keyframes: {
        bounceIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3) translateY(-50px)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.1) translateY(-10px)'
          },
          '70%': {
            transform: 'scale(0.9) translateY(5px)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)'
          }
        },
        fadeInUp: {
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-5deg) translateX(-10px)' },
          '50%': { transform: 'rotate(5deg) translateX(10px)' }
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.1)' }
        },
        breathing: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [],
}
