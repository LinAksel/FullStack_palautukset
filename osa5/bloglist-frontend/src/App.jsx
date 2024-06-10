import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage({
        isError: false,
        message: 'Logged in!',
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage({
        isError: true,
        message: `Login failed: ${exception.response.data.error}`,
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setMessage({
      isError: false,
      message: 'Logged out!',
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const createBlog = async (author, title, url) => {
    try {
      await blogService.postNew({
        author, title, url
      })
      setMessage({
        isError: false,
        message: `New blog "${title}" by ${author} added!`,
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      blogFormRef.current.toggleVisibility()
      return true
    } catch (exception) {
      setMessage({
        isError: true,
        message: `Error posting blog: ${exception.response.data.error}`,
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (blog) => {
    try {
      await blogService.updateBlog(blog)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch (exception) {
      setMessage({
        isError: true,
        message: `Blog update failed: ${exception.response.data.error}`,
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.deleteBlog(blog.id)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      setMessage({
        isError: false,
        message: `Blog ${blog.title} by ${blog.author} deleted successfully`,
      })
    } catch (exception) {
      setMessage({
        isError: true,
        message: `Blog deletion failed: ${exception.response.data.error}`,
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const blogsAndUser = () => {
    return <div>
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog}/>
        </Togglable>
      </div>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog}/>
      )}
    </div>
  }

  const loginForm = () => {
    return <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  }

  return (
    <div>
      <Notification message={message} />
      {!user && loginForm()}
      {user && blogsAndUser()}
    </div>
  )
}

export default App