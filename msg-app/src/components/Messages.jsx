// should be deleted 

import Message from "./Message"

const Messages = ({messages}) => {

  return (
    <>
      {messages.map((message) => (
      <Message key={message.id} message={message}/>
      ))}
    </>
  )
}

export default Messages
