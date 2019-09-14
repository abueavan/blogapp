const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const morgan = require('morgan')
morgan.token('post', (request) => {
  if(request.method === 'POST' || request.method === 'PUT') {
    return JSON.stringify(request.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))



mongoose.connect(config.MONGODB_BLOG_URI, { useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })
app.use(cors())
app.use(bodyParser.json())
app.use('/app/blogs', blogsRouter)

module.exports = app