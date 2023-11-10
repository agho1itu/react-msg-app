import Messages from "../components/Messages";
import Search from '../components/Search'
import { useState } from "react"
import Data from '../components/Data.json'
import Header from '../components/Header'

const ChatListPage = () => {
  const [messages, setMessages] = useState (Data)

  return (
    <div className='pageBody'>
      <Header type='withIcons' pageTitle='Chat List'/>

      <div className='container'>
        <h3 className='textAlignedLeft'>Hi Karin</h3> 

        <Search placeholder='Search your messages' data={Data}/>

        <h4>Recent chats</h4>

        <Messages messages={messages} />

      </div>
    </div>
  )
}

export default ChatListPage
