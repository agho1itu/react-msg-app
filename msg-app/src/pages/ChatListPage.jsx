import Search from '../components/Search'
import { useEffect, useState } from "react"
import Header from '../components/Header'
import Parse from 'parse';

const ChatListPage = () => {
  const [chatList, setChatList] = useState([]);
  const [currentUser, setCurrentUser] = useState('')

  // loading data from the DB
  useEffect(() => {
    loadChatData();
    fetchCurrentUser();
  }, []);

  // actual loading current user from the DB
  async function fetchCurrentUser() {
    const loggedInUser = Parse.User.current();
    if (loggedInUser) {
      await setCurrentUser(loggedInUser.get('fullName'));
    }
  };

  //actual loading data from the DB
  async function loadChatData() {
    let query = new Parse.Query('Chat');
    query.include('p1','p2');
  
    let listOfChats = await query.find();
    setChatList(listOfChats);
    console.log(chatList)

  if (chatList === undefined) {  
    return ("Loading...");  
  }  
  };

  return (
    <div className='pageBody'>
      <Header type='withIcons' pageTitle='Chat List' />
      <div className='container'>
        <h3 className='textAlignedLeft'>Hi {currentUser} </h3>
        <h4>Recent chats</h4>
        <div>
          {chatList.map(chat => (
            <div>{chat.get("p2").get("fullName") + '  -  ' + chat.get("p1").get("fullName")}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatListPage;
