const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, admin, async (req, res, next) => {
  try {
    const { eventType, startDate, endDate } = req.query;
    const query = {};

    if (eventType) query.eventType = eventType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const events = await Analytics.find(query).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
});

module.exports = router;