const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
    content: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        colors: {
            white: 'white',
            blue: {
                100: '#207fe4', // lightest
                200: '#2675EC', // primary
                300: '#1e70c7', // lighter
                400: '#1a65b6', // light
                500: '#1c6cc2', // dark
                600: '#1d6abb', // darker
                700: '#16589d'  // darkest
            },
            orange: {
                500: '#FF843A'
            },
            gray: {
                80: '#f1f1f1',
                100: '#e7e7e7',
                600: '#707070',
                700: '#565656',
                900: '#242526'
            }
        },
        extend: {}
    },
    plugins: []
})
