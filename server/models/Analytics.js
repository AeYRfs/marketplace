const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  userId: { type: String },
  eventType: { type: String, required: true },
  eventData: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
