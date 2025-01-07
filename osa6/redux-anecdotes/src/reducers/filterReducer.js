export const filterWith = (value) => {
    return {
        type: 'FILTER',
        payload: { value }
    }
}

const filterReducer = (state = '', action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch (action.type) {
      case 'FILTER': {
        return action.payload.value
      }
      default:
        return state;
    }
  }

export default filterReducer