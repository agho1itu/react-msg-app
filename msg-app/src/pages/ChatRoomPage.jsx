import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Input from '../components/Input';
import Parse from 'parse';
import { useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import scambot from '../components/assets/scambot.svg';
import send from '../components/assets/send.svg';

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [showScamPopup, setShowScamPopup] = useState(false);
  const [detectedScamWord, setDetectedScamWord] = useState(''); //State to hold the detected scam word
  const currentUser = Parse.User.current();
  let liveQuery;

  useEffect(() => {
    loadChatData(chatId, currentUser, setMessages, setOtherUser); // Call loadChatData
  }, [chatId, currentUser]); // Include chatId and currentUser in the dependency array

  useEffect(() => {
    liveQuery = new Parse.LiveQueryClient({
      applicationId: 'W4dCUDFH6etnlwT6NKFTixTxWFw5E0C24uAcnv6N',
      serverURL: 'ws://safechat4.b4a.io',
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

  //i replaced the 'handleSendMessage' function in the code -> now it checks if 'newMessageContent' is empty before sending
  const handleSendMessage = async () => {
    try {
      if (newMessageContent.trim() !== '') { // Check if message content is not empty or just whitespace
        const Message = new Parse.Object('Message');
        Message.set('sender', currentUser);
        Message.set('receiver', otherUser);
        Message.set('content', newMessageContent);
        Message.set('chat', Parse.Object.extend('Chat').createWithoutData(chatId));

        await Message.save();

        setNewMessageContent('');
      } else {
        console.log('Message content is empty!');
        // Optionally, you can show an alert or provide feedback to the user that the message cannot be empty
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const ScamWords = ['mitid', 'cpr', 'account'];

  const handleScamCheck = (newMessage) => {
    if (newMessage && newMessage.get('sender').id === otherUser.id) {
      const content = newMessage.get('content').toLowerCase();
      const detectedWord = ScamWords.find((scamWord) => content.includes(scamWord.toLowerCase()));

      if (detectedWord && !showScamPopup) {
        console.log('Scam word detected in the new message:', detectedWord);
        // Show the scam popup only if it's not already shown
        setDetectedScamWord(detectedWord); //Set the detected scam word
        setShowScamPopup(true);
      } else if (!detectedWord && showScamPopup) {
        //else, if scam words is not detected, the showScamPopup is set to 'false' = the pop-up is not triggered
        setShowScamPopup(false);
      }
    }
  };

  // Function to replace scam words with highlighted versions
  const highlightScamWords = (messageContent) => {
    // Split the message content into words
    const words = messageContent.split(' ');

    // Map through each word in the message content
    return words.map((word, wordIndex) => {
      // Check if the word matches any scam word
      const isScamWord = ScamWords.some((scamWord) => word.toLowerCase().includes(scamWord.toLowerCase()));

      if (isScamWord) {
        // If a scam word is found, wrap it in a <span> with a 'highlighted' class
        return <span key={wordIndex} className="highlighted">{word}{' '}</span>;
      }
      // If the word isn't a scam word, return it as it is
      return word + ' ';
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      handleScamCheck(lastMessage);
    }
    scrollToBottom();
  }, [messages]);

  //useRef is a React Hook: helps remember and control the position of the invisible <div> element, ensuring that whenever new messages arrive, the page scrolls down to display the latest message at the bottom of the chat container.
  //Create a reference to the bottom of the chat container
  const messagesEndRef = useRef(null);
  // Function to scroll to the bottom of the chat container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
 
  // blocking user by current user
  const isBlocked = async () => {
    try {
      const Block = Parse.Object.extend('Block');
      const query = new Parse.Query(Block);
  
      query.equalTo('blockingUser', currentUser);
      query.equalTo('blockedUser', otherUser);
  
      const result = await query.find();
      console.log('Query result:', result);
  
      // Check if the result array is empty
      return result.length > 0;
    } catch (error) {
      console.error('Error checking if user is blocked:', error);
      throw error;
    }
  };
  
  const blockUser = async () => {
    try {
      const Block = new Parse.Object('Block');
      Block.set('blockingUser', currentUser);
      Block.set('blockedUser', otherUser);

      await Block.save();

      console.log(`User with ID ${currentUser.id} blocked user with ID ${otherUser.id}`);
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  };

  const handleBlockUser = async () => {
    try {
      console.log('handleBlockUser called');
  
      const isUserBlocked = await isBlocked();
      console.log('Is user blocked:', isUserBlocked);
  
      if (!isUserBlocked) {
        await blockUser();
        console.log('User blocked successfully');
        // Consider updating the UI to reflect the blocked state
      } else {
        console.log('User is already blocked');
      }
    } catch (error) {
      console.error('Error handling block user:', error);
    }
  };
  

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
              <p>
                {/* Render the modified message content with highlighted scam words */}
                {highlightScamWords(msg.get('content'))}
              </p>
              <p className='sender-id'>{msg.get('sender').get('fullName')}</p>
              <p className='sender-id'>{msg.get('sender').get('fullName')}</p>
            </div>
          ))}
          {/* Create an invisible div that serves as a reference to scroll to */}
          <div ref={messagesEndRef} />
      </div>
      <div className='input-and-send '>
        <Input
          type='text'
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
          placeholder='Type your message...'
        />
        <button className='primaryButton' onClick={handleSendMessage}>
        <img src={send}></img>
        </button>
      </div>
    </div>
      {
    showScamPopup && (
      <Popup open modal closeOnDocumentClick={false}>
        <div className="popup-container">
          <div className='popup-bot'><img src={scambot}></img></div>
          <div className="popup-header">Possible Scam Alert!</div>
          <div className="popup-content">
              <p>We have detected possible scam in your message, due to the word:</p>
              <p className='scam-word'>"{detectedScamWord}"</p>
              <p>Remember never to give up your personal information.</p>
          </div>
          <div className="popup-actions">
            <button className="secondary-button" onClick={() => setShowScamPopup(false)}>
              I understand
            </button>
              <button className="secondary-button" onClick={handleBlockUser}>
                Block User
              </button>
          </div>
        </div>
      </Popup>
    )
  }
    </div >
  );
};

export default ChatRoomPage;

