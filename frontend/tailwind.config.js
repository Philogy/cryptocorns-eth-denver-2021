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
          100: '#E0E0E0',
          200: '#BDBDBD',
          300: '#828282',
          400: '#7B8093',
          500: '#4C4B58',
          600: '#2C2A35',
          700: '#1F2025',
          800: '#131417',
          900: '#0D0D0F'
        },
        tblue: {
          200: '#2F80ED'
        },
        tred: {
          100: '#CD6767'
        }
      },
      fontFamily: {
        serif: ['Work Sans']
      },
      backgroundImage: () => ({
        'landing-page': 'url(\'landing-bg.svg\')'
      })
    }
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'disabled'],
      opacity: ['disabled'],
      cursor: ['disabled'],
      textColor: ['active']
    }
  },
  plugins: []
}
