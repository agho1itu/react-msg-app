const Message = ({message}) => {
  return (
    <div className='message'>
      <h3 className='profilepic'>{message.id}</h3>
      <div className="messageNamePreview">
        <h3>{message.text}</h3>
        <p>{message.preview + ' ' + message.time}</p>
      </div>
    </div>
  )
}

export default Message
