import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const postNew = async blogdetails => {
  const response = await axios.post(baseUrl, blogdetails,{headers: {'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('loggedNoteappUser')).token}})
  return response.data
}

export default { getAll, postNew }