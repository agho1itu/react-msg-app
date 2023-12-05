import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Input from '../components/Input';
import Parse from 'parse';
import { useParams } from 'react-router-dom';

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const currentUser = Parse.User.current();
  let liveQuery;

  useEffect(() => {
    // I find no other way to use live query to put it in the local file
    liveQuery = new Parse.LiveQueryClient({
      applicationId: '2wNHlZeA7c6uqah1S53WQoSA2l5Aiz7NudJZgQcM',
      serverURL: 'ws://safechat.b4a.io',
    });

    // Open the WebSocket connection
    liveQuery.open();

    // Subscribe to the 'Message' class live query for the specific chatId
    const query = new Parse.Query('Message');
    query.equalTo('chat', Parse.Object.extend('Chat').createWithoutData(chatId));
    const subscription = liveQuery.subscribe(query);

    // Event listeners for live query events
    subscription.on('create', (object) => {
      setMessages((prevMessages) => [...prevMessages, object]);
    });

    subscription.on('update', (object) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === object.id ? object : msg))
      );
    });

    subscription.on('delete', (object) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== object.id));
    });

    // Load initial chat data
    loadChatData();

    return () => {
      // Close the subscription and WebSocket connection when the component unmounts
      subscription.unsubscribe();
      liveQuery.close();
    };
  }, [chatId]);

  const loadChatData = async () => {
    try {
      const chatRoom = new Parse.Object('Chat');
      chatRoom.id = chatId;
  
      const msgQuery1 = new Parse.Query('Message');
      msgQuery1.equalTo('receiver', currentUser);
      msgQuery1.equalTo('chat', chatRoom);
  
      const msgQuery2 = new Parse.Query('Message');
      msgQuery2.equalTo('sender', currentUser);
      msgQuery2.equalTo('chat', chatRoom);
  
      const mainMsgQuery = Parse.Query.or(msgQuery1, msgQuery2);
      mainMsgQuery.include('sender', 'receiver');
      mainMsgQuery.descending('createdAt'); // Sort by createdAt in descending order
  
      const messages = await mainMsgQuery.find();
  
      // Set otherUser based on the most recent message
      const mostRecentMessage = messages[0];
      const otherUserInChat = mostRecentMessage.get('sender') !== currentUser
        ? mostRecentMessage.get('sender')
        : mostRecentMessage.get('receiver');
  
      console.log('Other User:', otherUserInChat);
  
      setMessages(messages);
      setOtherUser(otherUserInChat);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const handleSendMessage = async () => {
    try {
      const Message = new Parse.Object('Message');
      Message.set('sender', currentUser);
      Message.set('receiver', otherUser);
      Message.set('content', newMessageContent);
      Message.set('chat', Parse.Object.extend('Chat').createWithoutData(chatId));

      // save the new message to Parse
      await Message.save();

      // clear the input field
      setNewMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className='pageBody'>
      <Header type='withBackButton' pageTitle={otherUser ? otherUser.get('fullName') : 'Chat Room'} />
      <div className='container'>
        {messages.map((msg) => (
          <div key={msg.id}>
            <p>{msg.get('content')}</p>
          </div>
        ))}
        <div>
          <Input
            type='text'
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            placeholder='type your message...'
          />
          <button className='primaryButton' onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;

