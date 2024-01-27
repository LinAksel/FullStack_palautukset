const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

const listWithOneBlog = helper.singleBlogList
const listWithMultipleBlogs = helper.initialBlogs

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })

  test('when list has only one blog is that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('of a bigger list is found correctly', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    expect(result).toEqual(listWithMultipleBlogs[2])
  })
})

describe('most blogs by one author', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe(null)
  })

  test('when list has only one blog is the author of that blog with count 1', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({ 'author': listWithOneBlog[0].author, 'blogs': 1 })
  })

  test('from a bigger list is the correct author and blog count', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result).toEqual({ 'author': listWithMultipleBlogs[3].author, 'blogs': 3 })
  })
})

describe('most liked author', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBe(null)
  })

  test('when list has only one blog equals author and likes of that blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({ 'author': listWithOneBlog[0].author, 'likes': listWithOneBlog[0].likes })
  })

  test('of a bigger list is the correct author and like count', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    expect(result).toEqual({ 'author': listWithMultipleBlogs[1].author, 'likes': 17 })
  })
})
