const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { trackEvent } = require('../services/analytics');

router.get('/:chatId', auth, async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ chatId: req.params.chatId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.userIds.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await trackEvent(req.user.userId, 'view_chat', { chatId: req.params.chatId });
    res.json(chat);
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { otherUserId } = req.body;
    const user = await User.findOne({ userId: req.user.userId });
    const otherUser = await User.findOne({ userId: otherUserId });

    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.restrictions.chatBanned) {
      return res.status(403).json({ message: 'You are banned from chatting' });
    }

    let chat = await Chat.findOne({
      userIds: { $all: [req.user.userId, otherUserId] }
    });

    if (!chat) {
      chat = new Chat({
        chatId: uuidv4(),
        userIds: [req.user.userId, otherUserId],
        messages: []
      });
      await chat.save();
    }

    await trackEvent(req.user.userId, 'start_chat', { otherUserId });
    res.json(chat);
  } catch (error) {
    next(error);
  }
});

module.exports = router;