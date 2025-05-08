const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { createNotification } = require('../services/notification');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const projectManager = require('../middleware/projectManager');
const { trackEvent } = require('../services/analytics');

router.post('/users/:userId/block', auth, admin, async (req, res, next) => {
  try {
    const { isBlocked } = req.body;
    await User.updateOne(
      { userId: req.params.userId },
      { 'restrictions.isBlocked': isBlocked }
    );

    const message = isBlocked 
      ? 'Your account has been blocked'
      : 'Your account has been unblocked';
    await createNotification(req.params.userId, message);
    
    await trackEvent(req.user.userId, 'admin_block_user', { 
      targetUserId: req.params.userId, 
      isBlocked 
    });
    res.json({ message });
  } catch (error) {
    next(error);
  }
});

router.post('/users/:userId/promote', auth, projectManager, async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'project_manager') {
      return res.status(400).json({ message: 'Cannot promote project manager' });
    }

    await User.updateOne(
      { userId: req.params.userId },
      { role: 'admin' }
    );

    await createNotification(req.params.userId, 'You have been promoted to admin');
    await trackEvent(req.user.userId, 'promote_admin', { targetUserId: req.params.userId });
    res.json({ message: 'User promoted to admin' });
  } catch (error) {
    next(error);
  }
});

router.get('/users', auth, admin, async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
});
