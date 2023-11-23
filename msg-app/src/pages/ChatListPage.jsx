import { useEffect, useState } from "react"
import Header from '../components/Header'
import Parse from 'parse';
import { Link } from 'react-router-dom'


const ChatListPage = () => {
  // Define chat list as an array to put data in - chat list in empty until we use setChatList to add data.
  const [chatList, setChatList] = useState([]);
  // A standard method in parse for getting the current user 
  const currentUser = Parse.User.current();

  // loading data from the DB - only loading 
  useEffect(() => {
    loadChatData();
  }, []);

  //actual loading data from the DB - the function that does stuff
  async function loadChatData() {

    // In query 1 get data from Chat where current user is p1
    let query1 = new Parse.Query('Chat');
    query1.equalTo('p1', currentUser);

    // Seperatly in query 2 get data from Chat where current user is p2
    let query2 = new Parse.Query('Chat');
    query2.equalTo('p2', currentUser);

    // new main query with current user both p1 and p2 - does the actual thing 
    let mainQuery = Parse.Query.or(query1, query2);
    // if this is removed we cannot access the fullName of the not currentUser
    mainQuery.include('p1', 'p2')

    try {
      //make the first list to save main query  
      let listOfChats = await mainQuery.find();
      // useState - use setChatList to add data 
      setChatList(listOfChats);
    } catch (error) {
      //Error handeling 
      console.error('Error fetching chats:', error);
    }
  };

  //If there is no chats show loading 
  if (chatList === 0) {
    return <p>'Loading...'</p>;
  }

  // only show the name of the sender - the user not current user 
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
        {/* Say Hi to the current user */}
        <h3 className='textAlignedLeft'>Hi {currentUser.get('fullName')} </h3>
        <h4>Recent chats</h4>
        <div>
          {/* use the now data filled chatlist to get fullname of p1 and p2, in chats current user is included in */}
          {chatList.map(chat => (
            <div key={chat.id}>
              <Link to={`/chat/${chat.id}`}> {getOtherUserFullName(chat)} </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatListPage;
