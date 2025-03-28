import { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { updateBlog, deleteBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateLikes = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 }
    dispatch(updateBlog(newBlog))
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog))
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            {blog.likes}
            <button onClick={updateLikes}>like</button>
          </div>
          {blog.user && <div>{blog.user['name']}</div>}
          <button onClick={removeBlog}>remove</button>
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
