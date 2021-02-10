const path = require('path')
const express = require('express')
const history = require('connect-history-api-fallback')

const app = express()

const port = process.env.PORT || 8081
const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'

console.log('joined:', path.join(__dirname, 'test-folder'))
console.log('__dirname: ', __dirname)

const staticPath = path.join(__dirname, 'static')
const staticMiddleware = express.static(staticPath)
const historyOptions = {
  disableDotRule: true,
  verbose: true
}

app.use(staticMiddleware)
app.use(history(historyOptions))
app.use(staticMiddleware)

app.listen(port, () =>
  console.log(`start server on port ${port}; mode: ${mode}; node version: ${process.version}`)
)
