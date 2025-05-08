const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { trackEvent } = require('../services/analytics');

router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await trackEvent(req.user.userId, 'view_notifications', {});
    res.json(user.notifications);
  } catch (error) {
    next(error);
  }
});

router.put('/:notificationId/read', auth, async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = user.notifications.find(
      (n) => n.notificationId === req.params.notificationId
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await user.save();

    await trackEvent(req.user.userId, 'mark_notification_read', {
      notificationId: req.params.notificationId
    });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;