const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndRemove(request.params.id)
  if (deletedBlog){
    response.status(204).end()
  }else{
    response.status(404).end()
  }
})

//replaceOne had to be used instead of findByIdAndUpdate, because runValidators did not work on latter
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const newBlog = await Blog.replaceOne({ _id: request.params.id }, body, { runValidators: true })
  if (newBlog.modifiedCount === 1){
    response.status(204).end()
  } else  {
    response.status(404).end()
  }

})


module.exports = blogsRouter
