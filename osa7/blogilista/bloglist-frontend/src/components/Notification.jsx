import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  if (notification === null || notification.message === null) {
    return null
  }
  if (notification.isError) {
    return <div className="error">{notification.message}</div>
  }
  return <div className="notification">{notification.message}</div>
}

export default Notification
