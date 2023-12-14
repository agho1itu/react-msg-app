import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Parse from 'parse';
import Header from '../components/Header';
import searchIcon from '../components/assets/search.svg'; // Import the SVG file


const ChatListPage = () => {
  // State variables to manage chat list, search term, and current user
  const [chatList, setChatList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = Parse.User.current();
  const [blockedUsers, setBlockedUsers] = useState([]);

  // Load chat data when the component mounts
  useEffect(() => {
    loadChatData();
    loadBlockedData();
  }, []);

  // Function to load chat data from the Parse database
  async function loadChatData() {
    // Create queries to retrieve chats where the current user is either p1 or p2
    let chatListQuery1 = new Parse.Query('Chat');
    chatListQuery1.equalTo('p1', currentUser);

    let chatListQuery2 = new Parse.Query('Chat');
    chatListQuery2.equalTo('p2', currentUser);

    // Combine the queries to fetch chats where the current user is involved
    let mainQuery = Parse.Query.or(chatListQuery1, chatListQuery2);
    mainQuery.include('p1', 'p2');

    try {
      // Retrieve chats based on the queries and set the chat list state
      let listOfChats = await mainQuery.find();
      setChatList(listOfChats);
    } catch (error) {
      // Error handling 
      console.error('Error fetching chats:', error);
    }
  }

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

  // Function to retrieve the full name of the other user in the chat
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

  // Function to handle changes in the search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to fetch the recent message for a specific chat
  const fetchRecentMessage = async (chat) => {
    const query = new Parse.Query('Message');
    query.equalTo('chat', chat);
    query.descending('createdAt');
    query.limit(1);
    return await query.first();
  };

  // State to hold recent messages for each chat
  const [recentMessages, setRecentMessages] = useState({});

  useEffect(() => {
    // Retrieve recent messages for each chat
    const promises = chatList.map(async (chat) => {
      const recentMessage = await fetchRecentMessage(chat);
      return { chat, recentMessage };
    });

    Promise.all(promises).then((chatsWithRecentMessages) => {
      const messagesMap = {};
      chatsWithRecentMessages.forEach(({ chat, recentMessage }) => {
        messagesMap[chat.id] = recentMessage;
      });
      setRecentMessages(messagesMap);
    });
  }, [chatList]);

  // Function to check if the other user in the chat is blocked
  const isBlockedUser = (chat) => {
    const otherUserId = chat.get("p1").id === currentUser.id
      ? chat.get("p2").id
      : chat.get("p1").id;

    return blockedUsers.some(blockedUser => blockedUser.get("blockedUser").id === otherUserId);
  };

  // Filter chats based on the search term
  const filteredChats = chatList.filter(chat =>
    getOtherUserFullName(chat)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) && !isBlockedUser(chat)
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = { weekday: 'short', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString('en-US', options);
  };

  return (
    <div className='page-body'>
      <Header type='withIcons' pageTitle='Chat List' />
      <div className='container'>
        <h3 className='text-aligned-left'>Hi {currentUser.get('fullName')} 👋</h3>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Chats"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
            style={{
              backgroundImage: `url(${searchIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '305px 50%',
            }}
          />
        </div>
        <h4 className="text-aligned-left">Your chats</h4>
        <div className='chat-list'>
          {filteredChats.map(chat => {
            const recentContent = recentMessages[chat.id] ? recentMessages[chat.id].get('content') : '';
            const words = recentContent.split(' ');
            const previewText = words.length > 5 ? `${words.slice(0, 5).join(' ')}...` : recentContent;

            return (
              <Link className='chat-box' to={`/chat_room/${chat.id}`}>
                <div key={chat.id} className="chat-preview" >
                  <div className="profile-pic">{getOtherUserFullName(chat)[0]}</div>
                  <div className='chat-flex'>
                    {getOtherUserFullName(chat)}

                    <div className='chat-details'>
                      <div className="preview-info">{previewText}</div>
                      <div className="timestamp">{formatTimestamp(recentMessages[chat.id]?.createdAt)}</div>
                    </div>
                  </div>

                </div>
              </Link>

            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChatListPage;