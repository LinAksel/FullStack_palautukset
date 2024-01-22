const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((acc, blog) => acc + blog.likes, 0)
  return likes
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0){
    return null
  }
  let maxLikes = 0
  let id = blogs[0]._id
  blogs.forEach(blog => {
    if(blog.likes > maxLikes){
      maxLikes = blog.likes
      id = blog._id
    }
  })
  const blog = blogs.find(blog => blog._id === id)
  return blog
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0){
    return null
  }
  const blogCount = {}
  blogs.forEach(blog => {
    if (!(blog.author in blogCount)){
      blogCount[blog.author] = 0
    }
    blogCount[blog.author]++
  })
  if(Object.keys(blogCount).length === 1) {
    return { 'author': Object.keys(blogCount)[0], 'blogs': blogCount[Object.keys(blogCount)[0]] }
  }
  const author = Object.keys(blogCount).reduce((a, b) => blogCount[a] > blogCount[b] ? a : b)
  return { 'author': author, 'blogs': blogCount[author] }
}

const mostLikes = (blogs) => {
  if(blogs.length === 0){
    return null
  }
  const likeCount = {}
  blogs.forEach(blog => {
    if (!(blog.author in likeCount)){
      likeCount[blog.author] = 0
    }
    likeCount[blog.author] += blog.likes
  })
  if(Object.keys(likeCount).length === 1) {
    return { 'author': Object.keys(likeCount)[0], 'likes': likeCount[Object.keys(likeCount)[0]] }
  }
  const author = Object.keys(likeCount).reduce((a, b) => likeCount[a] > likeCount[b] ? a : b)
  return { 'author': author, 'likes': likeCount[author] }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
