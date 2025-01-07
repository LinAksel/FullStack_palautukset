import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
        filterWith(state, action) {
            return action.payload
        }
    }
  })

export const { filterWith } = filterSlice.actions
export default filterSlice.reducer