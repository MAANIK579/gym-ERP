export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1A1A1D', // Very dark grey, almost black
        'secondary-dark': '#2C2F33', // Slightly lighter grey for cards
        'accent': '#4A90E2', // A strong, vibrant blue
        'accent-hover': '#4281CB',
      },
    },
  },
  plugins: [],
}