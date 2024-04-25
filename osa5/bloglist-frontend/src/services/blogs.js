import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const postNew = async blogdetails => {
  const response = await axios.post(baseUrl, blogdetails,{ headers: { 'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('loggedNoteappUser')).token } })
  return response.data
}

const updateBlog = async blog => {
  const { id, ...trimmedBlog } = blog
  const response = await axios.put(`${baseUrl}/${id}`, trimmedBlog,{ headers: { 'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('loggedNoteappUser')).token } })
  return response.data
}

const deleteBlog = async id => {
  const response = await axios.delete(`${baseUrl}/${id}`, { headers: { 'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('loggedNoteappUser')).token } })
  return response.data
}

export default { getAll, postNew, updateBlog, deleteBlog }