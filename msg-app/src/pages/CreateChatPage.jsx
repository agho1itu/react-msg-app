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
      // determine who is the other user using the userId 
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
      // create a new chat between current user and other user
      const Chat = new Parse.Object('Chat');
      Chat.set('p1', currentUser);
      Chat.set('p2', otherUser);

      // save chat to Back4App
      const newChat = await Chat.save();

      // set the chatId in the state
      setChatId(newChat.id);

      // create a new message
      const Message = new Parse.Object('Message');
      Message.set('sender', currentUser);
      Message.set('receiver', otherUser);
      Message.set('content', newMessageContent);
      Message.set('chat', Parse.Object.extend('Chat').createWithoutData(newChat.id));

      // save message to Back4App
      await Message.save();

      // clear the input field
      setNewMessageContent('');

      // redirect to the ChatRoomPage with the correct chatId
      navigate(`/chat_room/${newChat.id}`);
    } catch (error) {
      console.error('Error handling send message:', error);
    }
  };

  return (
    <div>
      <div className='pageBody'>
        <Header type='withBackButton' pageTitle={otherUser ? otherUser.get('fullName') : 'Chat Room'} />
        <div className='container'>
          <div>
            <Input
              type='text'
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              placeholder='type your Chat...'
            />
            <button className='primaryButton' onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChatPage;
