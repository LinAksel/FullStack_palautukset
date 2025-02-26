const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('salaisuus', 10)
  const user = new User({ username: 'testaaja', passwordHash })
  await user.save()
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
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send(helper.testUserLogin)
    await api
      .post('/api/blogs')
      .send(helper.singleBlogPost)
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.body.map((n) => n.title)
    expect(titles).toContain('This should now be in the database')
  })
  test('succeeds with undefined likes defaulting to 0', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send(helper.testUserLogin)
    const newBlog = {
      author: 'Test T. Tester',
      title: 'How to test a post call',
      url: 'testing.test',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd.body[helper.initialBlogs.length].likes).toEqual(0)
  })
  test('fails with status code 400 if title is missing', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send(helper.testUserLogin)
    const newBlog = {
      author: 'Test T. Tester',
      url: 'testing.test',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .send(newBlog)
      .expect(400)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)
  })
  test('fails with status code 400 if url is missing', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send(helper.testUserLogin)
    const newBlog = {
      author: 'Test T. Tester',
      title: 'How to test a post call',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .expect(400)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)
  })
  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      author: 'Test T. Tester',
      title: 'How to test a post call',
      url: 'testing.test',
    }
    await api.post('/api/blogs').send(newBlog).expect(401)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('is successful with status 204 if valid id is given and user is correct', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send(helper.testUserLogin)
    const newBlog = {
      author: 'Test T. Tester',
      title: 'How to test a post call',
      url: 'testing.test',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    const blogToDelete = response.body[helper.initialBlogs.length]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.body.map((b) => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
  test('fails with 404 if id does not exist in the database', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send(helper.testUserLogin)
    const invalidId = await helper.nonExistingId()
    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .expect(404)
  })
  test('fails with 401 if user is different', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send(helper.testUserLogin)
    const newBlog = {
      author: 'Test T. Tester',
      title: 'How to test a post call',
      url: 'testing.test',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    const blogToDelete = response.body[helper.initialBlogs.length]
    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'testiukko', passwordHash })
    await user.save()
    const loginResponseUkko = await api
      .post('/api/login')
      .send({ username: 'testiukko', password: 'salasana' })
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer ' + loginResponseUkko.body.token)
      .expect(401)
  })
})

describe('updating a blog', () => {
  test('is successful with status 204 if valid id and data is given', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[0]

    const updatedBlog = {
      author: 'Up T. Date',
      title: 'Being up to date',
      url: 'up.date',
      likes: 5,
    }

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(204)
    updatedBlog['id'] = blogToUpdate.id
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body[0]).toEqual(updatedBlog)
  })
  test('fails with status code 400 if url is missing', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[0]

    const updatedBlog = {
      author: 'Up T. Date',
      title: 'Being up to date',
      likes: 5,
    }

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(400)
  })
  test('fails with status code 400 if title is missing', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[0]

    const updatedBlog = {
      author: 'Up T. Date',
      url: 'up.date',
      likes: 5,
    }

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(400)
  })
  test('fails with 404 if id does not exist in the database', async () => {
    const updatedBlog = {
      author: 'Up T. Date',
      title: 'Being up to date',
      url: 'up.date',
      likes: 5,
    }
    const invalidId = await helper.nonExistingId()
    await api.put(`/api/blogs/${invalidId}`).send(updatedBlog).expect(404)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
