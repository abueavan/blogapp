const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response, next) => {
  try{
    const body = request.body

    if(!body.password || body.password.length < 3) {
      return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const saltRound = 10
    const passwordHash = await bcrypt.hash(body.password, saltRound)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

userRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users.map(u => u.toJSON()))
})

module.exports = userRouter