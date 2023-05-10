/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT ({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '600': '37.5rem',
      },

      width: {
        '500': '40rem',
      },
      colors: {
        'columbia' : '#F5EFED',
        'ecru' : '#DCC48E',
        'beige' : '#EAEFD3',
        'sandy' : '#FC9F5B',
        'tmbwolf' : '#FFFCF9',
      },
      fontFamily: {
        fontNav: ["Alatsi", "sans-serif"], 
        fontMenu: ['Encode_Sans', 'sans-serif'],
        fontDash: [ 'Josefin Sans', 'sans-serif'],
        font:['Hind', 'sans-serif'],
        fontPOS: ['Raleway', 'sans-serif'],
        fontP : ['Josefin Sans', 'sans-serif'],
        fontC: ['Archivo', 'sans-serif'],
        fontMain: [  'Bebas Neue', 'cursive' ] ,


      },
    },
  },
  plugins: [],
});


// /** @type {import('tailwindcss').Config} */

// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       height: {
//         '600': '37.5rem',
//       },

//       width: {
//         '500': '40rem',
//       },
//       colors: {
//         'columbia' : '#F5EFED',
//         'ecru' : '#DCC48E',
//         'beige' : '#EAEFD3',
//         'sandy' : '#FC9F5B',
//         'tmbwolf' : '#FFFCF9',
//       },
//       fontFamily: {
//         fontNav: ["Alatsi", "sans-serif"], 
//         fontMenu: ['Encode_Sans', 'sans-serif'],
//         fontDash: [ 'Josefin Sans', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// }
