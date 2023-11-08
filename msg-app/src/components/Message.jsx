// This is a functional component called "Message" that receives a "message" prop
const Message = ({message}) => {
  return (
  // A parent container for message 
    <div className='message'>
      <h3 className='profilepic'>{message.id}</h3>
      <div className="messageNamePreview">
        <h3>{message.text}</h3>
        <p>{message.preview + ' ' + message.time}</p>
      </div>
    </div>
  )
}
// Exporting the "Message" component to make it available for use in other parts of the application.
export default Message
