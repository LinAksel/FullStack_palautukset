const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user
    if (!blog || !blog.user) {
      return response.status(404).end()
    }

    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      const index = user.blogs.indexOf(request.params.id)
      user.blogs.splice(index, 1)
      await user.save()
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'not authorized' })
    }
  }
)

//replaceOne had to be used instead of findByIdAndUpdate, because runValidators did not work on latter
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const newBlog = await Blog.replaceOne({ _id: request.params.id }, body, {
    runValidators: true,
  })
  if (newBlog.modifiedCount === 1) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
