const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.post('/', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.body.blog)
    const comment = new Comment({
      content: request.body.content,
      blog: blog._id
    })
    const savedComment = await comment.save()
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()
    response.status(201).json(savedComment.toJSON())
  } catch(exception) {
    next(exception)
  }
})

commentsRouter.get('/', async (request, response) => {
  const comments = await Comment
    .find({})
    .populate('blog', { url: 1, title: 1, author: 1 })
  response.json(comments.map(comment => comment.toJSON()))
})

module.exports = commentsRouter