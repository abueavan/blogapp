const commentsRouter = require('express').Router()
const Comment = require('../models/comment')

commentsRouter.get('/', async (request, response) => {
  const comments = await Comment
    .find({})
    .populate('blog', { url: 1, title: 1, author: 1 })
  response.json(comments.map(comment => comment.toJSON()))
})

module.exports = commentsRouter