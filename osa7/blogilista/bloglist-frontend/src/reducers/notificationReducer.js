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
    },
  },
})

export const showNotification = (notification, timeout) => {
  return async (dispatch) => {
    dispatch(addNotification(notification))
    setTimeout(() => {
      dispatch(deleteNotification())
    }, timeout * 1000)
  }
}

export const { addNotification, deleteNotification } = notificationSlice.actions
export default notificationSlice.reducer
