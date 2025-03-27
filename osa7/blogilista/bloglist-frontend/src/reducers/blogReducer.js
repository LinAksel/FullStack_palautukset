import { createSlice } from '@reduxjs/toolkit'
import { showNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs.js'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    update(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    eraseBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
  },
})

export const createBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.postNew(content)
      dispatch(appendBlog(newBlog))
      dispatch(
        showNotification(
          {
            isError: false,
            message: `New blog "${content.title}" by ${content.author} added!`,
          },
          5
        )
      )
    } catch (exception) {
      dispatch(
        showNotification(
          {
            isError: true,
            message: `Error posting blog: ${exception.response.data.error}`,
          },
          5
        )
      )
    }
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const updateBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.updateBlog(blog)
      dispatch(update(blog))
    } catch (exception) {
      dispatch(
        showNotification(
          {
            isError: true,
            message: `Blog update failed: ${exception.response.data.error}`,
          },
          5
        )
      )
    }
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(blog.id)
      dispatch(eraseBlog(blog.id))
      dispatch(
        showNotification(
          {
            isError: false,
            message: `Blog ${blog.title} by ${blog.author} deleted successfully`,
          },
          5
        )
      )
    } catch (exception) {
      dispatch(
        showNotification(
          {
            isError: true,
            message: `Blog deletion failed: ${exception.response.data.error}`,
          },
          5
        )
      )
    }
  }
}

export const { update, appendBlog, setBlogs, eraseBlog } = blogSlice.actions
export default blogSlice.reducer
