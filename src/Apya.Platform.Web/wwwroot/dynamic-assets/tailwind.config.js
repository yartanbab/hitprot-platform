/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "../../Pages/**/*.{cshtml,html}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        },
        animation: {
            'blob': 'blob 7s infinite',
            'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        },
        keyframes: {
            blob: {
                '0%': { transform: 'translate(0px, 0px) scale(1)' },
                '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                '100%': { transform: 'translate(0px, 0px) scale(1)' },
            },
            fadeIn: {
                '0%': { opacity: '0', transform: 'translateY(15px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
            }
        }
    }
  },
  plugins: [],
}
