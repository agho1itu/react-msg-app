import MsgListHeader from "../components/MsgListHeader"
import OnlineStatus from "../components/OnlineStatus"
import search from '../components/assets/search.svg';
import Messages from "../components/Messages";
import Search from '../components/Search'
import { useState } from "react"
import Data from '../components/Data.json'

const MessageListPage = () => {
  const [messages, setMessages] = useState (Data)

  return (
    <div className='msglistbody'>
      <MsgListHeader />

      <div className='msglistcontainer'>
        <header className="msglistcontainerheader">
          <div className='msglistuseronline'>
            <OnlineStatus/>
            <h3>Hi Karin</h3> 
          </div>
          <img src={search} alt='Search'/> 
        </header>

        <Search placeholder='Search your messages' data={Data}/>

        <h4>Recent chats</h4>

        <Messages messages={messages} />

      </div>
    </div>
  )
}

export default MessageListPage
