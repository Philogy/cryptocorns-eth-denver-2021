const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, '../backend/static'),
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Verager.finance'
      return args
    })
  }
}
