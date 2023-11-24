import Header from '../components/Header'
import Input from '../components/Input'
import Parse from 'parse';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ChatRoomPage = () => {
  const { chatId } = useParams(); // get the 'id' from the route

  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessageContent, setNewMessageContent] = useState('');

  const currentUser = Parse.User.current();

  useEffect(() => {
    loadChatData();
  }, []); // there seems to be a lot of discussion if we should include the empty dependency array

  async function loadChatData() {
    try {
      const chatRoom = new Parse.Object('Chat');
      // define the chatroom to be the same as chats objectId
      chatRoom.id = chatId;

      // two queries for the 'Message' class to find current user as sender or reciever of a message
      let msgQuery1 = new Parse.Query('Message');
      msgQuery1.equalTo('receiver', currentUser);
      msgQuery1.equalTo('chat', chatRoom);

      let msgQuery2 = new Parse.Query('Message');
      msgQuery2.equalTo('sender', currentUser);
      msgQuery2.equalTo('chat', chatRoom);

      // create a compound query that takes any object that matches any of the individual queries. 
      let mainMsgQuery = Parse.Query.or(msgQuery1, msgQuery2);

      // include the 'sender' and 'receiver' to fetch user related data
      mainMsgQuery.include('sender', 'receiver');

      // retrieves a list of ParseObjects that satisfy this query and stores it in messages
      const messages = await mainMsgQuery.find();
      setMessages(messages);

      // load other user in chat 
      const otherUserInChat = getOtherUser(messages);
      setOtherUser(otherUserInChat);

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  // actual determine who is the other user in chat
  // there is a bug in this function, that defaults to chatroom even if the other user should be determined
  const getOtherUser = (messages) => {
    for (const msg of messages) {
      const sender = msg.get('sender');
      const receiver = msg.get('receiver');

      // check if the sender is not the current user
      if (sender && sender.id !== currentUser.id) {
        return sender;
      }

      // check if the receiver is not the current user
      if (receiver && receiver.id !== currentUser.id) {
        return receiver;
      }
    }

    // default return value in case our loop don't find a match.
    return null;
  };

  const handleSendMessage = async () => {
    console.log('handleSendMessage function called');
    try {
      const Message = new Parse.Object('Message');

      // use set function to determine sender, receiver, content, and chat for the new message
      // in the case the logged in user sends a messsage into the DB, they will always be the sender
      Message.set('sender', currentUser);
      Message.set('receiver', otherUser);
      Message.set('content', newMessageContent);
      Message.set('chat', Parse.Object.extend('Chat').createWithoutData(chatId)); //extend?

      // use save function to add the new message to the DB
      await Message.save();

      // reload the chat data after sending the message
      loadChatData();

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
        {messages.map(msg => (
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
          {/* Our button component could not handle the onClick */}
          <button className='primaryButton' onClick={handleSendMessage}> Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatRoomPage
