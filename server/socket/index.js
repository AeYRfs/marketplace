const Chat = require('../models/Chat');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const { createNotification } = require('../services/notification');
const { trackEvent } = require('../services/analytics');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;
    const user = await User.findOne({ userId });

    if (!user || user.restrictions.chatBanned) {
      socket.emit('connect_error', { message: 'Connection denied' });
      socket.disconnect();
      return;
    }

    console.log(`User ${userId} connected`);

    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${userId} joined chat ${chatId}`);
    });

    socket.on('sendMessage', async ({ chatId, messageText, senderId }) => {
      try {
        const chat = await Chat.findOne({ chatId });
        if (!chat || !chat.userIds.includes(senderId)) {
          socket.emit('error', { message: 'Invalid chat or access denied' });
          return;
        }

        const message = {
          messageId: uuidv4(),
          senderId,
          messageText,
          messageDate: new Date()
        };

        chat.messages.push(message);
        await chat.save();

        io.to(chatId).emit('message', message);

        const recipientId = chat.userIds.find((id) => id !== senderId);
        await createNotification(recipientId, `New message from ${user.userName}`);
        await trackEvent(senderId, 'send_message', { chatId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};
