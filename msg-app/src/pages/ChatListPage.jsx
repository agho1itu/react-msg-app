import { useEffect, useState } from "react"
import Header from '../components/Header'
import Parse from 'parse';

const ChatListPage = () => {
  // Define chat list as an array to put data in - chat list in empty until we use setChatList to add data
  const [chatList, setChatList] = useState([]);
  // A standard method in parse for getting the currentuser 
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

    // new mainquery with current user both p1 and p2 - does the actual thing 
    let mainQuery = Parse.Query.or(query1, query2);
    
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
  if (chatList === undefined) {  
    return ("Loading...");  
  }   

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
            <div>{chat.get("p2").get("fullName") + '  -  ' + chat.get("p1").get("fullName")}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatListPage;
