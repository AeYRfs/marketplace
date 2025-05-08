import { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

const socket = io('http://localhost:5000', {
  query: { userId: JSON.parse(localStorage.getItem('user'))?.userId }
});

function Chat({ chatId, otherUserId }) {
  const { t } = useContext(LanguageContext);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chats/${chatId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessages(res.data.messages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();

    socket.emit('joinChat', chatId);

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    socket.emit('sendMessage', {
      chatId,
      messageText,
      senderId: user.userId
    });

    setMessageText('');
  };

  return (
    <div className="chat">
      <h3>{t.chat_with} {otherUserId}</h3>
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.messageId}
            className={msg.senderId === user.userId ? 'sent' : 'received'}
          >
            <p>{msg.messageText}</p>
            <span>{new Date(msg.messageDate).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={t.type_message}
        />
        <button type="submit">{t.send}</button>
      </form>
    </div>
  );
}

export default Chat;
