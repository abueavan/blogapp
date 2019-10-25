const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    require: true
  },
  blog: {
    type: mongoose.Types.ObjectId,
    ref: 'Blog',
  }
})

commentSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id
    delete returnObject._id
    delete returnObject._v
  }
})

module.exports = mongoose.model('Comment', commentSchema)