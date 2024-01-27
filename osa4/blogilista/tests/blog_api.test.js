const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('all blogs have id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    await api
      .post('/api/blogs')
      .send(helper.singleBlogPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.body.map((n) => n.title)
    expect(titles).toContain('This should now be in the database')
  })
  test('succeeds with undefined likes defaulting to 0', async () => {
    const newBlog = {
      author: 'Test T. Tester',
      title: 'How to test a post call',
      url: 'testing.test'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd.body[helper.initialBlogs.length].likes).toEqual(0)
  })
  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Test T. Tester',
      url: 'testing.test'
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)
  })
  test('fails with status code 400 if url is missing', async () => {
    const newBlog = {
      author: 'Test T. Tester',
      title: 'How to test a post call'
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})
