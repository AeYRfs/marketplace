const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const createNotification = async (userId, message) => {
  const notification = {
    notificationId: uuidv4(),
    message,
    read: false,
    createdAt: new Date()
  };

  await User.updateOne(
    { userId },
    { $push: { notifications: notification } }
  );
};

module.exports = { createNotification };