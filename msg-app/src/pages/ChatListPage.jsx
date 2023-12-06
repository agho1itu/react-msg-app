import { useEffect, useState } from "react";
import Header from '../components/Header';
import Parse from 'parse';
import { Link } from 'react-router-dom';
import searchIcon from '../components/assets/search.svg'; // import the SVG file

const ChatListPage = () => {
  //state variables to manage chat list, search term, and current user
  const [chatList, setChatList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = Parse.User.current();

  //loead chat data when the component mounts or when LoadChatData changes
  useEffect(() => {
    loadChatData();
  }, [loadChatData]); // include loadChatData in the dependency array  

  //function to load chat data from the Parse database
  async function loadChatData() {
    //create two queries to retrieve chat where the current user is either p1 or p2
    let chatListQuery1 = new Parse.Query('Chat');
    chatListQuery1.equalTo('p1', currentUser);

    let chatListQuery2 = new Parse.Query('Chat');
    chatListQuery2.equalTo('p2', currentUser);

    //combine the queries to fetch chats where the current user is involved
    let mainQuery = Parse.Query.or(chatListQuery1, chatListQuery2);
    mainQuery.include('p1', 'p2');

    try {
      //retrive chats based on the queries and set the chat list state
      let listOfChats = await mainQuery.find();
      setChatList(listOfChats);
    } catch (error) {
      //Error handeling 
      console.error('Error fetching chats:', error);
    }
  }

  //function to retrive the full name of the other user in the chat
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

  //function to handle changes in the search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredChats = chatList.filter(chat =>
    getOtherUserFullName(chat)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()
      ));


  return (
    <div className='pageBody'>
      <Header type='withIcons' pageTitle='Chat List' />
      <div className='container'>
        <h3 className='textAlignedLeft'>Hi {currentUser.get('fullName')} </h3>
        <div className="searchContainer">
          <input
            type="text"
            placeholder=" "
            value={searchTerm}
            onChange={handleSearch}
            className="searchInput"
            style={{
              backgroundImage: `url(${searchIcon})`, // Set background image
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '10px 50%', // Adjust position of the icon
              paddingLeft: '40px', // Create space for the icon
            }}
          />
        </div>
        <h4>Recent chats</h4>
        <div>
          {filteredChats.map(chat => (<div key={chat.id}>
            <Link to={`/chat_room/${chat.id}`}>{getOtherUserFullName(chat)}</ Link>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatListPage;
