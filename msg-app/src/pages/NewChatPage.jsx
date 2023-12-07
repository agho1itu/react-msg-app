import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Parse from "parse";
import Header from "../components/Header";
import searchIcon from '../components/assets/search.svg'; // import the SVG file



const NewChatPage = () => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    loadChatData();
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

  //function to handle changes in the search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredChats = userList.filter(chat =>
    chat.user.get('fullName')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className='pageBody'>
      <Header type='withBackButton' pageTitle='New Chat' />
      <div className='container'>
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Search through contacts"
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
        {filteredChats.map(({ user, existingChat }) => {
          const userFullName = user.get('fullName');
          const chatLink = existingChat ? `/chat_room/${existingChat.id}` : `/new_chat_room/${user.id}`;
          const linkText = existingChat ? `${userFullName}` : userFullName;
          return (
            <div className='message-list' key={user.id}>
              <div className="profilepic">{user.get('fullName')[0]}</div>
              <Link to={chatLink}>{linkText}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewChatPage;