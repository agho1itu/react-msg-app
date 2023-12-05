import { useEffect, useState } from "react"
import Header from '../components/Header'
import Parse from 'parse';
import { Link } from 'react-router-dom'


const ChatListPage = () => {
  // define chat list as an array to put data in - chat list in empty until we use setChatList to add data.
  const [chatList, setChatList] = useState([]);
  // a standard hook in parse for getting the current user 
  const currentUser = Parse.User.current();

  // load data from the DB  
  useEffect(() => {
    loadChatData();
  });

  // actual loading data from the DB - the function that does stuff
  async function loadChatData() {

    // In chatListQuery1 we get data from 'Chat' where current user is p1
    let chatListQuery1 = new Parse.Query('Chat');
    chatListQuery1.equalTo('p1', currentUser);

    // Seperatly in chatListchatListQuery2 we get data from 'Chat' where current user is p2
    let chatListQuery2 = new Parse.Query('Chat');
    chatListQuery2.equalTo('p2', currentUser);

    // create a compound query that takes any object that matches any of the individual queries. 
    let mainQuery = Parse.Query.or(chatListQuery1, chatListQuery2);

    // include the 'p1' and 'p2' to fetch user related data
    mainQuery.include('p1', 'p2')

    try {
      // retrieves a list of ParseObjects that satisfy out query and stores it in listOfChats
      let listOfChats = await mainQuery.find();
      // use setChatList to store our data in chatList
      setChatList(listOfChats);
    } catch (error) {
      // error handeling 
      console.error('Error fetching chats:', error);
    }
  };

  // if there is no chats in chatList show 'Loading...' 
  if (chatList === 0) {
    return <p>'Loading...'</p>;
  }

  // get the name of the user not currently logged in 
  const getOtherUserFullName = (chat) => {
    const p1 = chat.get("p1");
    const p2 = chat.get("p2");

    if (p1.id === currentUser.id) {
      return p2.get("fullName");
    } else if (p2.id === currentUser.id) {
      return p1.get("fullName");
    }

    return null;
  };


  return (
    <div className='pageBody'>
      <Header type='withIcons' pageTitle='Chat List' />
      <div className='container'>
        <h3 className='textAlignedLeft'>Hi {currentUser.get('fullName')} </h3>
        <h4>Recent chats</h4>
        <div className='chat-list'>
          {chatList.map(chat => (
            <div key={chat.id} className="message">
              <div className="profilepic">{getOtherUserFullName(chat)[0]}</div>
              <Link to={`/chat_room/${chat.id}`}> {getOtherUserFullName(chat)} </Link>
              <div
                className='previewInfo'> preview her
              </div>
              <div
                className='time'> 12:45
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatListPage;
