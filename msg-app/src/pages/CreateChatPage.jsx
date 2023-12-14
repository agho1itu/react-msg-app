import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import Header from '../components/Header';
import Input from '../components/Input';

const CreateChatPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = Parse.User.current();
  const [otherUser, setOtherUser] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    loadOtherUser();
  }, []);

  const loadOtherUser = async () => {
    try {
      // Fetch the other user using the userId 
      let otherUserQuery = new Parse.Query('User');
      otherUserQuery.equalTo('objectId', userId);
      let otherUserFind = await otherUserQuery.find();

      if (otherUserFind.length > 0) {
        setOtherUser(otherUserFind[0]);
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error loading other user:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      if (newMessageContent.trim() !== '') { // Check if message content is not empty or just whitespace
        // Create a new chat between current user and other user
        const Chat = new Parse.Object('Chat');
        Chat.set('p1', currentUser);
        Chat.set('p2', otherUser);

        // Save chat to Back4App
        const newChat = await Chat.save();

        // Set the chatId in the state
        setChatId(newChat.id);

        // Create a new message
        const Message = new Parse.Object('Message');
        Message.set('sender', currentUser);
        Message.set('receiver', otherUser);
        Message.set('content', newMessageContent);
        Message.set('chat', Parse.Object.extend('Chat').createWithoutData(newChat.id));

        // Save message to Back4App
        await Message.save();

        // Clear the input field
        setNewMessageContent('');

        // Redirect to the ChatRoomPage with the correct chatId
        navigate(`/chat_room/${newChat.id}`);
      } else {
        console.log('Message content is empty!');
        // Optionally, you can show an alert or provide feedback to the user that the message cannot be empty
      }
    } catch (error) {
      console.error('Error handling send message:', error);
    }
  };

  return (
    <div>
      <div className='page-body'>
        <Header type='withBackButton' pageTitle={otherUser ? otherUser.get('fullName') : 'Chat Room'} />
        <div className='container'>
          <div>
            <Input
              type='text'
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              placeholder='type your Chat...'
            />
            <button className='primary-button' onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChatPage;

