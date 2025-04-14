/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          twinkle: "twinkle 3s infinite ease-in-out",
        },
        keyframes: {
          twinkle: {
            "0%, 100%": {
              opacity: "0.2",
              transform: "scale(0.8)",
            },
            "50%": {
              opacity: "1",
              transform: "scale(1.2)",
            },
          },
        },
      },
    },
    plugins: [],
  };
  