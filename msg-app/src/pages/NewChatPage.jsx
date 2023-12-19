import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Parse from "parse";
import Header from "../components/Header";
import searchIcon from '../components/assets/search.svg'; // import the SVG file

const NewChatPage = () => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const currentUser = Parse.User.current();

  useEffect(() => {
    loadChatData();
    loadBlockedData();
  }, []);

  const loadChatData = async () => {
    // check if a user has an existing chat with another user.
    try {
      const currentUser = Parse.User.current();
  
      // retrieving existing chat information
      const existingChatsQueryP1 = new Parse.Query('Chat');
      existingChatsQueryP1.equalTo('p1', currentUser);
  
      const existingChatsQueryP2 = new Parse.Query('Chat');
      existingChatsQueryP2.equalTo('p2', currentUser);
  
      const existingChatsQuery = Parse.Query.or(existingChatsQueryP1, existingChatsQueryP2);
  
      // gets a list of existing chats including with the currentUser
      const existingChats = await existingChatsQuery.find();
  
      // does currentUser have a chat with the other user
      const existingChatsMap = {};
      existingChats.forEach(chat => {
        const otherUserId = chat.get('p1').id === currentUser.id ? chat.get('p2').id : chat.get('p1').id;
        existingChatsMap[otherUserId] = chat;
      });
  
      // gets a list of all users
      let userQuery = new Parse.Query('User');
      let listOfUsers = await userQuery.find();
  
      // loop through users and check if there is an existing chat --> creates a list each object represents a user along with their corresponding existing chat information 
      const updatedUserList = listOfUsers.map(user => {
        const existingChat = existingChatsMap[user.id];
        return { user, existingChat };
      });
  
      setUserList(updatedUserList);
    } catch (error) {
      console.error('Error loading chat data:', error);
    }
  };
  

  const loadBlockedData = async () => {
    try {
      const currentUser = await Parse.User.currentAsync();
      const listOfBlockedUsers = new Parse.Query('Block');
      listOfBlockedUsers.equalTo('blockingUser', currentUser);
      listOfBlockedUsers.include('blockingUser', 'blockedUser');

      const blockedUsersArray = await listOfBlockedUsers.find();
      setBlockedUsers(blockedUsersArray);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    }
  };

  // function to handle changes in the search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // function to check if the other user in the chat is blocked
  const isBlockedUser = ({ existingChat }) => {
    if (!existingChat) {
      return false; // if there is no existing chat, the user is not blocked
    }

    const otherUserId = existingChat.get("p1").id === currentUser.id
      ? existingChat.get("p2").id
      : existingChat.get("p1").id;

    return blockedUsers.some(blockedUser => blockedUser.get("blockedUser").id === otherUserId);
  };

  const filteredChats = userList.filter(chat =>
    chat.user.get('fullName')
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) && !isBlockedUser(chat)
  );

  return (
    <div className='page-body'>
      <Header type='withBackButton' pageTitle='New Chat' />
      <div className='container'>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Contacts"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
            style={{
              backgroundImage: `url(${searchIcon})`, // set background image
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '305px 50%', // adjust position of the icon
            }}
          />
        </div>
        {filteredChats.map(({ user, existingChat }) => {
          const userFullName = user.get('fullName');
          const chatLink = existingChat ? `/chat_room/${existingChat.id}` : `/new_chat_room/${user.id}`; // where is the currentUser navigated when clicking other user
          const linkText = existingChat ? `${userFullName}` : userFullName;
          return (
            <Link className='chat-box' to={chatLink}>
              <div className='chat-preview' key={user.id}>
                <div className="profile-pic">{user.get('fullName')[0]}</div>
                {linkText}
              </div>
            </Link>
          );
        })}
      </div>
    </div >
  );
};

export default NewChatPage;