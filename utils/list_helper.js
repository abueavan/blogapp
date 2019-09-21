const _ = require('lodash')
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    if(blog.likes)
      return sum + blog.likes
    else return sum
  }, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0)
    return null
  const favorite = blogs.reduce((favorite, blog) => {
    if(blog.likes > favorite.likes)
      return blog
    else return favorite
  }, blogs[0])
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0)
    return null
  const counts = _.countBy(blogs, 'author')
  console.log(counts)
  const most = _.reduce(counts,(result, value, key) => {
    if(value > result.blogs) {
      result.author = key
      result.blogs = value
      return result
    }
  },{ author: '', blogs: 0 })
  return most
}

const mostLikes = (blogs) => {
  if(blogs.length === 0)
    return null
  const groups = _.groupBy(blogs, o => o.author)
  const most = _.reduce(groups, (result, value, key) => {
    const likes = _.sumBy(value, 'likes')
    if(likes > result.likes){
      result.author = key
      result.likes = likes
    }
    return result
  }, { author: '', likes: 0 })
  return most
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}