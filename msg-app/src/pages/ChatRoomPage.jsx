import Header from '../components/Header'
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Parse from 'parse';

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log(chatId);
  }, [chatId]);

  
  return (
    <div className='pageBody'>
      <Header type='withBackButton' pageTitle='Name of resipient' />
      <div className='container'>
        {/* Wirte code here */}
      </div>
    </div>

  )
}

export default ChatRoomPage
