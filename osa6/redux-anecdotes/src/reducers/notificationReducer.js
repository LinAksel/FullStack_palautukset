import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notificationSlice',
    initialState: null,
    reducers: {
        addNotification(state, action) {
            return action.payload
        },
        deleteNotification() {
            return null
        }
    }
  })

export const showNotification = (content, timeout) => {
  return async dispatch => {
    dispatch(addNotification(content))
    setTimeout(() => {
        dispatch(deleteNotification())
      }, timeout*1000)
  }
}

export const { addNotification, deleteNotification } = notificationSlice.actions
export default notificationSlice.reducer