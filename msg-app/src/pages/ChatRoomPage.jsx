import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Input from '../components/Input';
import Parse from 'parse';
import { useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [showScamPopup, setShowScamPopup] = useState(false);
  const currentUser = Parse.User.current();
  let liveQuery;

  useEffect(() => {
    loadChatData();
  }, [chatId]);

  useEffect(() => {
    liveQuery = new Parse.LiveQueryClient({
      applicationId: 'CWTtJ1moggMgSrzdTUjHl3UwQpowT0P9WYCaEPKB',
      serverURL: 'ws://safechat3.b4a.io',
    });

    liveQuery.open();
    console.log('WebSocket connection opened');

    const query = new Parse.Query('Message');
    query.equalTo('chat', Parse.Object.extend('Chat').createWithoutData(chatId));
    const subscription = liveQuery.subscribe(query);

    subscription.on('create', (object) => {
      setMessages((prevMessages) => [...prevMessages, object]);
      handleScamCheck(object);
    });

    subscription.on('update', (object) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === object.id ? object : msg))
      );
    });

    subscription.on('delete', (object) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== object.id));
    });

    return () => {
      subscription.unsubscribe();
      liveQuery.close();
    };
  }, [chatId]);

  const loadChatData = async () => {
    try {
      const chatRoom = new Parse.Object('Chat');
      chatRoom.id = chatId;

      const chatUsers = await chatRoom.fetch({ include: ['p1', 'p2'] });
      const user1 = chatUsers.get('p1');
      const user2 = chatUsers.get('p2');

      const otherUserInChat = user1.id === currentUser.id ? user2 : user1;

      const msgQuery = new Parse.Query('Message');
      msgQuery.equalTo('chat', chatRoom);
      msgQuery.include('sender', 'receiver');
      msgQuery.ascending('createdAt');

      const messages = await msgQuery.find();

      setMessages(messages);
      setOtherUser(otherUserInChat);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const Message = new Parse.Object('Message');
      Message.set('sender', currentUser);
      Message.set('receiver', otherUser);
      Message.set('content', newMessageContent);
      Message.set('chat', Parse.Object.extend('Chat').createWithoutData(chatId));

      await Message.save();

      setNewMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const ScamWords = ['mitid', 'cpr', 'account'];

  const handleScamCheck = (newMessage) => {
    if (newMessage && newMessage.get('sender').id === otherUser.id) {
      const content = newMessage.get('content').toLowerCase();
      const isScam = ScamWords.some((scamWord) => content.includes(scamWord.toLowerCase()));

      if (isScam && !showScamPopup) {
        console.log('Scam word detected in the new message:', newMessage);
        // Show the scam popup only if it's not already shown
        setShowScamPopup(true);
      } else if (!isScam && showScamPopup) {
        //else, if scam words is not detected, the showScamPopup is set to 'false' = the pop-up is not triggered
        setShowScamPopup(false);
      }
    }
  };


  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      handleScamCheck(lastMessage);
    }
  }, [messages]);

  return (
    <div className='pageBody'>
      <Header type='withBackButton' pageTitle={otherUser ? otherUser.get('fullName') : 'Chat Room'} />
      <div className='container'>
        <div className='container-scroll'>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.get('sender').id === currentUser.id ? 'currentUser' : 'otherUser'}`}
            >
              <p>{msg.get('content')}</p>
              <p className='sender-id'>{msg.get('sender').get('fullName')}</p>
            </div>
          ))}
        </div>
        <div className='input-and-send '>
          <Input
            type='text'
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            placeholder='Type your message...'
          />
          <button className='primaryButton' onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
      {showScamPopup && (
        <Popup open modal closeOnDocumentClick={false}>
          <div className="popup-container">
            <div className="popup-header">Possible Scam Alert!</div>
            <div className="popup-content">
              We have detected a possible scam in your message. Remember never to give up your personal information.
            </div>
            <div className="popup-actions">
              <button className="secondary-button" onClick={() => setShowScamPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default ChatRoomPage;

