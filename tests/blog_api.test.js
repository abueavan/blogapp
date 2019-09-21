const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  for(let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
},9000)
describe('when there is initially some blogs saved', () => {
  test('all blogs are return ', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const body = response.body
    //   const blogs =  await Blog.find({})
    //   for(let i=0; i < blogs.length; ++i) {
    //     expect(body[i].id).toBeDefined()
    //     expect(body[i].id).toBe(blogs[i]._id.toString())
    //   }
    body.map(blog => expect(blog.id).toBeDefined())
  })

  describe('addition of a new blog', () => {
    test('blog with valid data', async () => {
      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await Blog.find({})
      expect(blogsAtEnd.length).toBe(initialBlogs.length + 1)
    })

    test('blog without likes is added', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
      expect(response.body.likes).toBe(0)

    })

    test('blog without title and url is not added', async () => {
      const newBlog = {
        author: 'Edsger W. Dijkstra',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await Blog.find({})

      expect(blogsAtEnd.length).toBe(initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await Blog.find({})
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .expect(204)

      const blogsAtEnd = await Blog.find({})

      expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)

      const titles = blogsAtEnd.map(blog => blog.title)

      expect(titles).not.toContain(blogToDelete.title)
    })
  })

  describe('update of a blog', () => {
    test('succeeds if id is valid', async () => {
      const blogsAtStart = await Blog.find({})
      const blogToUpdate = blogsAtStart[0]

      const updatedLikes = { likes: blogToUpdate.likes + 1 }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedLikes)

      const blogsAtEnd = await Blog.find({})

      expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + 1)
    })
  })
})


afterAll(() => {
  mongoose.connection.close()
})

