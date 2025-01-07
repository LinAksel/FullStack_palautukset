import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notificationSlice',
    initialState: null,
    reducers: {
        showNotification(state, action) {
            return action.payload
        },
        deleteNotification() {
            return null
        }
    }
  })

export const { showNotification, deleteNotification } = notificationSlice.actions
export default notificationSlice.reducer