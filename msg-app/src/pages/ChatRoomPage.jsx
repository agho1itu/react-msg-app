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
  //This is set to false so the pop-up is not always displayed (i think)
  const [showScamPopup, setShowScamPopup] = useState(false);

  const currentUser = Parse.User.current();
  let liveQuery;

  useEffect(() => {
    loadChatData();
  }, [chatId]); // load initial chat data when the chatId changes

  useEffect(() => {
    // I find no other way to use live query to put it in the local file
    liveQuery = new Parse.LiveQueryClient({
      applicationId: 'ZGpRVylGtuaaaDeThtIbmbTysyYrHmynWPtsrHYd',
      serverURL: 'ws://safechat20.b4a.io',
    });

    // Open the WebSocket connection
    liveQuery.open();
    console.log('WebSocket connection opened');

    // Subscribe to the 'Message' class live query for the specific chatId
    const query = new Parse.Query('Message');
    query.equalTo('chat', Parse.Object.extend('Chat').createWithoutData(chatId));
    const subscription = liveQuery.subscribe(query);

    // Event listeners for live query 
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
      // Close the subscription and WebSocket connection when the component unmounts
      subscription.unsubscribe();
      // liveQuery.close();
    };
  }, [chatId]);

  const loadChatData = async () => {
    try {
      const chatRoom = new Parse.Object('Chat');
      chatRoom.id = chatId;

      // Fetch the chat to get the participants
      const chatUsers = await chatRoom.fetch({ include: ['p1', 'p2'] });
      const user1 = chatUsers.get('p1');
      const user2 = chatUsers.get('p2');

      // Determine the other user based on the participants
      const otherUserInChat = user1.id === currentUser.id ? user2 : user1;

      // Fetch messages
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

      // save the new message to Parse
      await Message.save();

      // clear the input field
      setNewMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  let ScamWords = ['mitid', 'cpr', 'account'];
  //he handleScamCheck function is responsible for checking whether scam words are present in the messages.
  const handleScamCheck = () => {
    //it filters through the messages array to find messages that contains scam words
    const scamMessages = messages.filter((msg) => {
      const content = msg.get('content').toLowerCase();
      return ScamWords.some((scamWord) => content.includes(scamWord.toLowerCase()));
    });

    //if scam words are detected, the showScamPopup is set to 'true'
    if (scamMessages.length > 0) {
      console.log('Scam words detected in messages:', scamMessages);
      //if scam words are detected, the showScamPopup is set to 'true' = the pop-up is triggered
      setShowScamPopup(true);
    } else {
      //else, if scam words is not detected, the showScamPopup is set to 'false' = the pop-up is not triggered
      setShowScamPopup(false);
    }
  };

  // call the scam check function whenever messages are updated
  useEffect(() => {
    handleScamCheck();
    // the effect will only trigger when new messages are added
  }, [messages.length]);

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
            placeholder='type your message...'
          />
          <button className='primaryButton' onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
      {/* By using {showScamPopup && (...)} the pop-up will only be renderet when showScamPopup = 'true'
          The Popup-component is set to 'open' = allowing it to be visible when showScamPopup = 'true' 
          The closeOnDocumentClick={false} prevent the pop-up from closing when clicking outsie of it
          The close button (popup-close) sets the showScamPopup to 'false' hiding the pop-up on-click*/}
      {showScamPopup && (
        <Popup open modal closeOnDocumentClick={false}>
          <div className="popup-container">
            <div className="popup-header">Scam Alert!</div>
            <div className="popup-content">
              Scam words have been detected in the message!
            </div>
            <div className="popup-actions">
              <button className="popup-close" onClick={() => setShowScamPopup(false)}>
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
