const http = require('http')
const app = require('./app')
const config = require('./utils/config')

const sever = http.createServer(app)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})