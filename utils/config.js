require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_BLOG_URI = process.env.MONGODB_BLOG_URI


if (process.env.NODE_ENV === 'test') {
  MONGODB_BLOG_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  PORT,
  MONGODB_BLOG_URI
}