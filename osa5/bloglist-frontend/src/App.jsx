import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)

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
        message: `Logged in!`,
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
      message: `Logged out!`,
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const blogsAndUser = () => {
    return <div>
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      {newBlogForm()}
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  }

  const postBlog = async (event) => {
    event.preventDefault()
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
      setAuthor('')
      setTitle('')
      setUrl('')
      const blogs = await blogService.getAll()
      setBlogs(blogs)
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

  const newBlogForm = () => {
    return <div>
      <h2>Create new</h2>
      <form onSubmit={postBlog}>
        <div>
          title:
            <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
            <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
            <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  }

  const loginForm = () => {
    return <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
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