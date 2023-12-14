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
    try {
      const currentUser = Parse.User.current();

      const existingChatsQuery = new Parse.Query('Chat');
      existingChatsQuery.equalTo('p1', currentUser);

      const existingChats = await existingChatsQuery.find();

      const existingChatsMap = {};
      existingChats.forEach(chat => {
        const otherUserId = chat.get('p2').id;
        existingChatsMap[otherUserId] = chat;
      });

      let userQuery = new Parse.Query('User');
      let listOfUsers = await userQuery.find();

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

  //function to handle changes in the search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to check if the other user in the chat is blocked
  const isBlockedUser = ({ existingChat }) => {
    if (!existingChat) {
      return false; // If there is no existing chat, the user is not blocked
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
              backgroundImage: `url(${searchIcon})`, // Set background image
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '305px 50%', // Adjust position of the icon
            }}
          />
        </div>
        {filteredChats.map(({ user, existingChat }) => {
          const userFullName = user.get('fullName');
          const chatLink = existingChat ? `/chat_room/${existingChat.id}` : `/new_chat_room/${user.id}`;
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