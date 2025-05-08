const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageId: { type: String, required: true },
  senderId: { type: String, required: true },
  messageText: { type: String, required: true },
  messageDate: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  userIds: [{ type: String, required: true }],
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);