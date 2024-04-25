const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  if (message.isError) {
    return <div className="error">{message.message}</div>
  }
  return <div className="notification">{message.message}</div>
}

export default Notification