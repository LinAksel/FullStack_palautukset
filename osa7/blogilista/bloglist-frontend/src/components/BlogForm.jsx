import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const postBlog = async (event) => {
    event.preventDefault()
    dispatch(createBlog({ author, title, url }))
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={postBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            data-testid="title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Write title here"
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            data-testid="author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Write author name here"
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            data-testid="url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder="Write url here"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
