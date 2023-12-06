import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Parse from "parse";
import Header from "../components/Header";


const NewChatPage = () => {
  const [userList, setUserList] = useState([]);

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

  return (
    <div className='pageBody'>
      <Header type='withBackButton' pageTitle='New Chat' />
      <div className='container'>
        {userList.map(({ user, existingChat }) => {
          const userFullName = user.get('fullName');
          const chatLink = existingChat ? `/chat_room/${existingChat.id}` : `/new_chat_room/${user.id}`;
          const linkText = existingChat ? `${userFullName} (Chat exists)` : userFullName;

          return (
            <div key={user.id}>
              <Link to={chatLink}>{linkText}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewChatPage;