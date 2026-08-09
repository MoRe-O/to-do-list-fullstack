// E:/coding/react/to-do-list/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default { // 👈 Use 'export default' instead of 'module.exports'
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {},
    },
    plugins: [],
}