const Analytics = require('../models/Analytics');
const { v4: uuidv4 } = require('uuid');

const trackEvent = async (userId, eventType, eventData) => {
  const event = new Analytics({
    eventId: uuidv4(),
    userId,
    eventType,
    eventData,
    createdAt: new Date()
  });

  await event.save();
};

module.exports = { trackEvent };
