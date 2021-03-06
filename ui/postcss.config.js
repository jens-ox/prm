const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    tailwindcss('./tailwind.js'),
    autoprefixer({
      add: true
    }),
    process.env.NODE_ENV === 'production' ? purgecss({
      content: [
        './src/**/*.html',
        './src/**/*.vue'
      ],
      whitelist: ['body']
    }) : ''
  ]
}
