module.exports = {
  purge: ['./public/index.html', './src/**/*.{vue,js}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderWidth: {
        3: '3px'
      },
      colors: {
        tgray: {
          200: '#E0E0E0',
          300: '#BDBDBD',
          400: '#4C4B58',
          500: '#2C2A35',
          600: '#1F2025',
          800: '#131417',
          900: '#0D0D0F'
        },
        tblue: {
          200: '#2F80ED'
        }
      },
      fontFamily: {
        serif: ['Work Sans']
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['hover']
    }
  },
  plugins: []
}
